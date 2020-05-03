import { localStoredContent, StoredLists } from "../background"

export interface TinySchema {
    [rule: string]: {
        latestAccess: number
        frequency: number
        everageTimeCost: number
    }
}

export interface RecentSchema {
    [requestID: string]: {
        timeCost: number
        latestAccess: number
        url: string
    }
}

export interface PendingContent {
    url: string
    timeCost: number
}

export interface ErrorContent {
    url: string
    returnedCode: number
    errorMessage: string
}

export class TinyDB {

    private custom_rules?: TinySchema
    private white_list?: TinySchema
    private pac_list_personal?: TinySchema
    private pac_rules_gfw?: TinySchema
    private blocked_list?: TinySchema
    private ignored_list?: TinySchema
    private todo_list?: TinySchema
    private error_list?: ErrorContent[]
    private recentList?: RecentSchema

    private pending_list?: PendingContent[]

    private propsIndex: { [key in StoredLists]: TinySchema | undefined } = {
        'pac_personal': this.pac_list_personal,
        'pac_gfw': this.pac_rules_gfw,
        'whiteList': this.white_list,
        'blockedList': this.blocked_list,
        'ignoredList': this.ignored_list,
        'customRules': this.custom_rules
    }

    public setPendingList(list: PendingContent[]) {
        this.pending_list = list
        //chrome.storage.local.set({ 'pendingList': list })
    }

    public getPendingList() {
        return this.pending_list
    }

    private static db: TinyDB

    private constructor() {

    }

    public static getDB() {
        if (!TinyDB.db) {
            TinyDB.db = new TinyDB()
        }
        return TinyDB.db
    }

    public init() {
        chrome.storage.local.get(items => {
            this.pac_list_personal = items[localStoredContent.pac_personal]
            this.pac_rules_gfw = items[localStoredContent.pac_gfw]
            this.white_list = items[localStoredContent.whiteList]
            this.blocked_list = items[localStoredContent.blockedList]
            this.ignored_list = items[localStoredContent.ignoredList]
            this.custom_rules = items[localStoredContent.customRules]
        })
        this.error_list = []
        this.recentList = {}
    }

    public printData() {
        console.log(this.white_list)
    }

    private printErrors() {
        console.log(this.error_list)
    }

    public localSave() {
        chrome.storage.local.set({ [localStoredContent.pac_personal]: this.pac_list_personal })
        chrome.storage.local.set({ [localStoredContent.pac_gfw]: this.pac_rules_gfw })
        chrome.storage.local.set({ [localStoredContent.whiteList]: this.white_list })
        chrome.storage.local.set({ [localStoredContent.blockedList]: this.blocked_list })
        chrome.storage.local.set({ [localStoredContent.ignoredList]: this.ignored_list })
        chrome.storage.local.set({ [localStoredContent.customRules]: this.custom_rules })
    }

    private matchesGfwRules(domain: string) {
        return false
    }

    public insertNewRecord(url: string, timeCost: number, lastAccess: number, state: 'complete' | 'error', returnedCode: number) {
        if (state == 'error') {
            this.insertNewErrorRecord(url, returnedCode)
        } else {
            let domain = getDomainFromUrl(url)
        }
    }

    private insertNewErrorRecord(url: string, returnedCode: number) {
        //this.error_list?.push({ url: url, returnedCode: returnedCode })
        this.printErrors()
    }

    public getListByName(name: StoredLists | 'recent') {
        if (name == 'recent') {
            return this.recentList
        } else {
            return this.propsIndex[name]
        }
    }

    public moveRecord(from: StoredLists, to: StoredLists, name: string) {
        let list_from = this.propsIndex[from]
        if (list_from) {
            let item_from = list_from[name]
            let list_to = this.propsIndex[to]
            if (!list_to) {
                list_to = {}
            }
            list_to[name] = item_from
            delete list_from[name]
        }
    }

    public moveRecordFromRecent(to: StoredLists, id: string) {
        let list_from = this.recentList
        if (list_from) {
            let item_from = list_from[id]
            let url = item_from.url
            let dm = getDomainFromUrl(url)
            let list_to = this.propsIndex[to]
            if (list_to) {
                let item_to = list_to[dm]
                if (item_to) {
                    item_to.frequency += 1
                } else {
                    item_to = {
                        latestAccess: item_from.latestAccess,
                        everageTimeCost: item_from.timeCost,
                        frequency: 1
                    }
                }
            }
            delete list_from[id]
        }
    }
}

export function matchesRule(domain: string, rule: string) {

}

export function getDomainFromUrl(url: string) {
    let a = url.split('//')[1]?.split('/')[0]
    return a == undefined ? 'invalid' : a
}

