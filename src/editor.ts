import { logTinyPacList, retrieveNewItems } from "./whats_new"

const panal = document.getElementById('editorPanel')

const div = document.createElement('div')
div.innerText = 'test'
div.onclick = function () {
    retrieveNewItems()
}
panal?.appendChild(div)

const div2 = document.createElement('div')
div2.innerText = 'tiny'
div2.onclick = function () {
    logTinyPacList()
}
panal?.appendChild(div2)

export { }