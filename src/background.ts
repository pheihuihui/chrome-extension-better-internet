import { Details } from "@material-ui/icons"

function validateTheUrl(url: string) {
    if (url.match('youtube')?.index) {
        return true
    } else {
        return false
    }
}

export type TTabsProxyEnabled = Record<number, boolean>
export type TPageType = 'pac' | 'local' | 'domestic'
export type TProxyType = 'direct' | 'fixed'
export type THistory = {
    URL: string
    Host: string
}

export const localStoredContent = {
    proxyServer: 'proxy_address',
    personalPac: 'pac_personal',
    gfwPac: 'pac_gfw'
}

const tabsProxyEnabled: TTabsProxyEnabled = {}

let cur_proxy: TProxyType = 'direct'

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

function switchToDirect() {
    chrome.proxy.settings.set({ value: _direct }, () => {
        cur_proxy = 'direct'
        chrome.browserAction.setBadgeText({ text: '' })
    })
}

function switchToFixed() {
    chrome.proxy.settings.set({ value: _fixed }, () => {
        cur_proxy = 'fixed'
        chrome.browserAction.setBadgeText({ text: '!' })
    })
}

// chrome.webRequest.onBeforeRequest.addListener(detail => {
//     let id = detail.tabId
//     let pr = tabsProxyEnabled[id]
//     if ((pr && cur_proxy == 'direct') || (!pr && cur_proxy == 'fixed')) {
//         return { cancel: true }
//     }
// }, {
//     urls: ["<all_urls>"]
// }, ["blocking"])


// chrome.tabs.onActivated.addListener(info => {
//     chrome.tabs.get(info.tabId, tab => {
//         if (tab.url && validateTheUrl(tab.url)) {
//             tabsProxyEnabled[info.tabId] = true
//             switchToFixed()
//         } else {
//             tabsProxyEnabled[info.tabId] = false
//             switchToDirect()
//         }
//     })
// })

chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (tab.url && validateTheUrl(tab.url)) {
        tabsProxyEnabled[id] = true
    } else {
        tabsProxyEnabled[id] = false
    }
})

chrome.tabs.onCreated.addListener(tab => {
    if (tab.id) {
        if (tab.url && validateTheUrl(tab.url)) {
            tabsProxyEnabled[tab.id] = true
        } else {
            tabsProxyEnabled[tab.id] = false
        }
    }
})


chrome.tabs.query({ currentWindow: true }, res => {
    console.log(res.map(x => x.id))
})

chrome.browserAction.setBadgeText({ text: '!' })
chrome.browserAction.setBadgeBackgroundColor({ color: 'red' })
chrome.contextMenus.create({
    title: 'hi',
    onclick: () => { alert('hi') },
    enabled: true,
    visible: true
})

let histories: THistory[] = []
chrome.webRequest.onBeforeRequest.addListener(details => {
    let url = new URL(details.url)
    let host = url.host
    histories.push({
        URL: details.url,
        Host: host
    })
}, {
    urls: ["<all_urls>"]
}, [])

declare global {
    interface Window {
        histories: any
    }
}

window.histories = histories

chrome.proxy.settings.set({ value: { mode: 'system' } })