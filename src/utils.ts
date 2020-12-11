import { CombinedMatcher } from "./pac_im"

export type TTabsProxyEnabled = Record<number, boolean>
export type TPageType = 'pac' | 'local' | 'domestic'
export type TProxyType = 'direct' | 'fixed'
export type THistory = { URL: string, Host: string }
export type TNewPacItems = Record<number, { added?: string[], removed?: string[] }>
export type TPacItems = string[]

export const gfwPacUrl = 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt'
export const tinyPacUrl = 'https://raw.githubusercontent.com/gfwlist/tinylist/master/tinylist.txt'
export const _localStorageContentFieldName = {
    proxyServer: 'proxy_address',
    personalPac: 'pac_personal',
    gfwPac: 'pac_gfw',
    whatsNew: 'whats_new'
}
export const _proxyMatcher = new CombinedMatcher()
export const _adBlockMatcher = new CombinedMatcher()
export const _tabsProxyEnabled: TTabsProxyEnabled = {}
export const _directMode: chrome.proxy.ProxyConfig = {
    mode: 'direct'
}
export const _fixedMode: chrome.proxy.ProxyConfig = {
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
export const _allUrlsFilter: chrome.webRequest.RequestFilter = { urls: ["<all_urls>"] }

export function asGlobalClass<T extends { new(...args: any[]): {} }>(className: string) {
    return (constructor: T) => {
        Object.assign(window, { [className]: constructor })
    }
}

export const intersection = <T>(...arrays: Array<Array<T>>) => {
    let tmp = new Set<T>()
    for (const iterator of arrays) {
        for (const uterator of iterator) {
            tmp.add(uterator)
        }
    }
    return Array.from(tmp)
}
