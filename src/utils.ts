export type TTabsProxyEnabled = Record<number, boolean>
export type TPageType = 'pac' | 'local' | 'domestic'
export type TProxyType = 'direct' | 'fixed'
export type THistory = { URL: string, Host: string }
export type TNewItems = Record<number, { added?: string[], removed?: string[] }>
export type TAllItems = string[]

export const gfwPacUrl = 'https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt'
export const tinyPacUrl = 'https://raw.githubusercontent.com/gfwlist/tinylist/master/tinylist.txt'
export const _localStorageContentFieldName = {
    proxyServer: 'proxy_address',
    personalPac: 'pac_personal',
    gfwPac: 'pac_gfw',
    whatsNew: 'whats_new'
}

export function asGlobalClass<T extends { new(...args: any[]): {} }>(className: string) {
    return (constructor: T) => {
        Object.assign(window, { [className]: constructor })
    }
}
