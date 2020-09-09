import { TinyDB } from "./Analyzor/DB";
import { RequestAnalyzor, setIntervalX } from "./Analyzor/RequestAnalyzor";

export const localStoredContent = {
    settings: 'settings',
    pac_personal: 'pac_personal',
    pac_gfw: 'pac_gfw',
    whiteList: 'whiteList',
    blockedList: 'blockedList',
    ignoredList: 'ignoredList',
    recentList: 'recentList',
    customRules: 'customRules'
}

const StoredListNames = ['pac_personal', 'pac_gfw', 'whiteList', 'blockedList', 'ignoredList', 'customRules'] as const
type StoredListType = typeof StoredListNames
export type StoredLists = StoredListType[number]

export interface ListenerSettings {
    onBeforeRequest: boolean
    onCompleted: boolean
    onErrorOccurred: boolean
    serverAddress?: string
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'settings': {} as ListenerSettings })
    chrome.storage.local.set({ 'pac_personal': {} })
    chrome.storage.local.set({ 'pac_gfw': {} })
    chrome.storage.local.set({ 'whiteList': {} })
    chrome.storage.local.set({ 'blockedList': {} })
    chrome.storage.local.set({ 'ignoredList': {} })
    chrome.storage.local.set({ 'recentList': {} })
    //chrome.proxy.settings.set({ value: _fixed })
})

const db = TinyDB.getDB()
db.init()
const ana = new RequestAnalyzor(db);

export const listn_req = (detail: chrome.webRequest.WebRequestBodyDetails) => {
    ana.accept_onBeforeRequest(detail)
}

export const listn_comp = (detail: chrome.webRequest.WebResponseCacheDetails) => {
    ana.accept_onCompleted(detail)
}

export const listn_err = (detail: chrome.webRequest.WebResponseErrorDetails) => {
    ana.accept_onErrorOccurred(detail)
}

chrome.webRequest.onBeforeRequest.addListener(listn_req, { urls: [] }, [])
chrome.webRequest.onCompleted.addListener(listn_comp, { urls: [] }, [])
chrome.webRequest.onErrorOccurred.addListener(listn_err, { urls: [] }, [])

chrome.alarms.create('getPendingList', {
    delayInMinutes: 1,
    periodInMinutes: 1
})

chrome.alarms.onAlarm.addListener(al => {
    if (al.name == 'getPendingList') {
        setIntervalX(() => ana.refreshPendingList(), 2000, 30)
    }
})

setIntervalX(() => ana.refreshPendingList(), 2000, 30)

export interface MessageType {
    method: 'get' | 'set' | 'publish'
    list?: StoredLists | 'recent'
    update?: {
        item: string
        from: StoredLists | 'recent'
        to: StoredLists
    }
}

chrome.runtime.onMessage.addListener((req: MessageType, sender, sendResponse) => {

    if (req.method == 'get') {
        if (req.list) {
            sendResponse(db.getListByName(req.list))
        }
    }

    if (req.method == 'set') {
        if (req.update) {
            if (req.update.from == 'recent') {

            } else {
                db.moveRecord(req.update.from, req.update.to, req.update.item)
            }
        } else {
            console.log('missing parameters')
        }
    }

    if (req.method == 'publish') {
        db.localSave()
        //sync with v2ray
    }

    sendResponse('unknown command')

})

let _direct: chrome.proxy.ProxyConfig = {
    mode: 'direct'
}

let _fixed: chrome.proxy.ProxyConfig = {
    mode: 'fixed_servers',
    rules: {
        singleProxy: {
            host: '127.0.0.1',
            port: 10800
        },
        bypassList: [

        ]
    }
}
