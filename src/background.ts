import { BlockingFilter, CombinedMatcher, Filter, RegExpFilter } from "./pac_im"
import { testRules } from "./tests/testRules"

export type TTabsProxyEnabled = Record<number, boolean>
export type TPageType = 'pac' | 'local' | 'domestic'
export type TProxyType = 'direct' | 'fixed'
export type THistory = {
    URL: string
    Host: string
}

export const _localStoredContent = {
    proxyServer: 'proxy_address',
    personalPac: 'pac_personal',
    gfwPac: 'pac_gfw'
}

const _proxyMatcher = new CombinedMatcher()
const _adBlockMatcher = new CombinedMatcher()
const _tabsProxyEnabled: TTabsProxyEnabled = {}
const _directMode: chrome.proxy.ProxyConfig = {
    mode: 'direct'
}
const _fixedMode: chrome.proxy.ProxyConfig = {
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
const _allUrlsFilter: chrome.webRequest.RequestFilter = { urls: ["<all_urls>"] }

let cur_proxy: TProxyType = 'direct'
let cur_tab = 0

chrome.storage.local.set({ [_localStoredContent.personalPac]: testRules })
chrome.storage.local.set({ [_localStoredContent.proxyServer]: '127.0.0.1:10800' })

chrome.storage.local.get(Object.values(_localStoredContent), result => {
    // get server
    let server = result[_localStoredContent.proxyServer] as string
    let addr = server.split(":")[0]
    let port = server.split(":")[1]
    if (_fixedMode.rules?.singleProxy) {
        _fixedMode.rules.singleProxy.host = addr
        if (port) {
            _fixedMode.rules.singleProxy.port = parseInt(port)
        }
    }

    // get rules
    let allRules = result[_localStoredContent.personalPac] as string[]
    for (const rule of allRules) {
        _proxyMatcher.add(Filter.fromText(rule) as RegExpFilter)
    }
})

chrome.webRequest.onBeforeRequest.addListener(detail => {
    let id = detail.tabId
    let pr = _tabsProxyEnabled[cur_tab]
    if (id != -1) {
        if ((pr && cur_proxy == 'direct') || (!pr && cur_proxy == 'fixed')) {
            return { cancel: true }
        }
    } else {
        // service worker tab id is -1
        let isPac = validateUrl(detail.initiator ?? '')
        if ((pr && !isPac) || (!pr && isPac)) {
            return { cancel: true }
        }
    }
}, _allUrlsFilter, ["blocking"])

chrome.tabs.onActivated.addListener(info => {
    chrome.tabs.get(info.tabId, tab => {
        if (tab.id) {
            let newUrl = getCurrentUrlFromTab(tab)
            if (newUrl) {
                if (validateUrl(newUrl)) {
                    _tabsProxyEnabled[tab.id] = true
                    cur_tab = tab.id
                    switchToFixed()
                } else {
                    _tabsProxyEnabled[tab.id] = false
                    cur_tab = tab.id
                    switchToDirect()
                }
            }
        }
    })
})

chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (tab.id) {
        let newUrl = getCurrentUrlFromTab(tab)
        if (newUrl) {
            if (validateUrl(newUrl)) {
                _tabsProxyEnabled[tab.id] = true
                switchToFixed()
            } else {
                _tabsProxyEnabled[tab.id] = false
                switchToDirect()
            }
        }
    }
})

chrome.tabs.onCreated.addListener(tab => {
    if (tab.id) {
        let newUrl = getCurrentUrlFromTab(tab)
        if (newUrl) {
            if (validateUrl(newUrl)) {
                _tabsProxyEnabled[tab.id] = true
                switchToFixed()
            } else {
                _tabsProxyEnabled[tab.id] = false
                switchToDirect()
            }
        }
    }
})

chrome.contextMenus.create({
    title: 'Add current url to PAC',
    onclick: () => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            let pendingUrl = tabs[0].pendingUrl
            let url = tabs[0].url
            console.log(pendingUrl ?? url)
            // chrome.tabs.create({ url: 'options.html' })
        })
    },
    enabled: true,
    visible: true
})

function validateUrl(url: string) {
    let host = new URL(url).host
    if (_proxyMatcher.matchesAny(url, host) instanceof BlockingFilter) {
        return true
    } else {
        return false
    }
}

function switchToDirect() {
    chrome.proxy.settings.set({ value: _directMode }, () => {
        cur_proxy = 'direct'
        chrome.browserAction.setBadgeText({ text: '' })
    })
}

function switchToFixed() {
    chrome.proxy.settings.set({ value: _fixedMode }, () => {
        cur_proxy = 'fixed'
        chrome.browserAction.setBadgeText({ text: '!' })
        chrome.browserAction.setBadgeBackgroundColor({ color: 'red' })
    })
}

function getCurrentUrlFromTab(tab: chrome.tabs.Tab) {
    if (tab.pendingUrl) {
        return tab.pendingUrl
    } else {
        return tab.url
    }
}


///////////////////////for debuging///////////////////////
// chrome.tabs.onUpdated.addListener((id, info, tab) => {
//     console.log('updated', info)
// })

// chrome.webRequest.onBeforeRequest.addListener(details => {
//     console.log(details)
// }, _allUrlsFilter, [])

// chrome.tabs.onCreated.addListener(tab => {
//     console.log(tab)
// })

declare global {
    interface Window {
        validateUrl: any
    }
}

window.validateUrl = validateUrl
//////////////////////////////////////////////////////////
