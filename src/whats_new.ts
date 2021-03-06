import { personalPacRules } from "./personal_pac_rules"
import { gfwPacUrl, intersection, tinyPacUrl, TNewPacItems, _localStorageContentFieldName } from "./utils"

export function retrieveNewPacItems() {
    fetch(gfwPacUrl).then(x => x.text()).then(v => {
        let newPac = atob(v).match(/[^\r\n]+/g)
        let [curPacName, wnew] = [_localStorageContentFieldName.personalPac, _localStorageContentFieldName.whatsNew]
        chrome.storage.local.get([curPacName, wnew], res => {
            let curPac = res[curPacName] as string[]
            let preUpdates = res[wnew] as TNewPacItems
            let added = newPac?.filter(s => !curPac.includes(s))
            let removed = curPac.filter(s => !newPac?.includes(s))
            if (added?.length != 0 || removed.length != 0) {
                let time = Date.now()
                preUpdates[time] = { added: added, removed: removed }
                console.log(preUpdates)
            } else {
                console.log('nothing')
            }
            chrome.storage.local.set({ [curPacName]: newPac })
            chrome.storage.local.set({ [wnew]: preUpdates })
        })
    })
}

export function retrievePacList() {
    return fetch(tinyPacUrl).then(x => x.text()).then(v => {
        let tn = atob(v).match(/[^\r\n]+/g)?.filter(z => !z.startsWith('!')) ?? []
        let psn = personalPacRules
        return intersection(tn, psn)
    })
}
