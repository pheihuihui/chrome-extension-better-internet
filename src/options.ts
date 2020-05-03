
import ReactDOM from "react-dom"
import { optionSwitches } from "./functionComponents/Settings"
import { logs } from "./functionComponents/LogArea"
import { ListenerSettings } from './background'
import { vt } from "./functionComponents/VerticalTabs"
import { TinySchema } from "./Analyzor/DB"

export const logTypesNames = ['beforeRequest', 'beforeSendHeaders', 'sendHeaders', 'headersReceived', 'authRequired', 'beforeRedirect', 'responseStarted', 'errored', 'completed'] as const
type TypeOflogTypesName = typeof logTypesNames
export type LogType = TypeOflogTypesName[number]

export let globalSettings: ListenerSettings
export let globalCustomRules: TinySchema
export let globalGfwRules: TinySchema

chrome.storage.local.get(items => {
    globalSettings = items['settings'] ?? {}
    globalCustomRules = items['customRules'] ?? {}
    globalGfwRules = items['pac_gfw'] ?? {}
})

let dis = document.getElementById('displayPanel')!
ReactDOM.render(vt, dis)