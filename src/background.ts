export type TTabsProxyEnabled = Record<number, boolean>

export const localStoredContent = {
    proxyServer: 'proxy_address',
    personalPac: 'pac_personal',
    gfwPac: 'pac_gfw'
}

const proxies: TTabsProxyEnabled = {}

let cur_proxy: 'direct' | 'fixed' = 'direct'

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

chrome.webRequest.onBeforeRequest.addListener(detail => {
    let id = detail.tabId
    let pr = proxies[id]
    if ((pr && cur_proxy == 'direct') || (!pr && cur_proxy == 'fixed')) {
        return { cancel: true }
    }
})

const checkUrl = (url: string): 'chrome' | 'pac' | 'domestic' => {
    return 'pac'
}

chrome.tabs.onActivated.addListener(info => {
    chrome.tabs.get(info.tabId, tab => {
        if (tab.url && checkUrl(tab.url) == 'domestic') {
            proxies[info.tabId] = false
        } else {
            proxies[info.tabId] = true
        }
    })
})

chrome.tabs.onUpdated.addListener((id, info) => {
    if (info.url && checkUrl(info.url) == 'domestic') {
        proxies[id] = false
    } else {
        proxies[id] = true
    }
})
