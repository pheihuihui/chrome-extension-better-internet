import { Filter, RegExpFilter, BlockingFilter } from "./pac_im"
import { TProxyType, _localStorageContentFieldName, _fixedMode, _proxyMatcher, _tabsProxyEnabled, _allUrlsFilter, _directMode } from "./utils"
import { retrievePacList } from "./whats_new"


let cur_proxy: TProxyType = 'direct'
let cur_tab = 0

chrome.runtime.onInstalled.addListener(details => {
    retrievePacList().then(x => {
        chrome.storage.local.set({ [_localStorageContentFieldName.personalPac]: x })
    })
})
chrome.storage.local.set({ [_localStorageContentFieldName.proxyServer]: '127.0.0.1:10800' })
chrome.storage.local.set({ [_localStorageContentFieldName.whatsNew]: {} })

chrome.storage.local.get(Object.values(_localStorageContentFieldName), result => {
    // get server
    let server = result[_localStorageContentFieldName.proxyServer] as string
    let addr = server.split(":")[0]
    let port = server.split(":")[1]
    if (_fixedMode.rules?.singleProxy) {
        _fixedMode.rules.singleProxy.host = addr
        if (port) {
            _fixedMode.rules.singleProxy.port = parseInt(port)
        }
    }

    // get rules
    let allRules = result[_localStorageContentFieldName.personalPac] as string[]
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


export { }