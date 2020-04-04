import { ButtonState } from "./DataTypes"

let collectButton = document.getElementById('collectButton') as SVGCircleElement | null

let current: ButtonState
chrome.storage.local.get(items => {
    current = items['state']
    if (current == 'collecting') {
        collectButton!.style.fill = 'red'
    } else {
        collectButton!.style.fill = 'green'
    }
})

if (collectButton) {
    collectButton.onclick = () => {
        if (current == 'collecting') {
            collectButton!.style.fill = 'green'
            chrome.storage.local.set({ 'state': 'ready' })
            current = 'ready'
            // chrome.storage.local.set({ 'collected': [] })
        } else {
            chrome.storage.local.set({ 'collected': [] })
            collectButton!.style.fill = 'red'
            chrome.storage.local.set({ 'state': 'collecting' })
            current = 'collecting'
        }
    }
}
