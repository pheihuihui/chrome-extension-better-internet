
import ReactDOM from "react-dom"
import { RawRecord, DomainStatistics, RequestDetails, StringIndexable, V2RayMessage } from "./DataTypes"
import { getDomainFromUrl } from "./Analyzor/DB"


chrome.storage.local.get(items => {
    let collected = items['collected'] as RawRecord[]
    let dis = document.getElementById('displayPanel')!
    let st = sortRequests(collected)
    // let pacForm = getMyPacForm(st, [], [])
    // ReactDOM.render(pacForm, dis)
})

function sortRequests(recs: RawRecord[]) {
    let st: DomainStatistics = {}
    let tmp = recs.map(item => getDomainFromUrl(item.url))
    let latest = 0
    if (recs.length > 1) {
        latest = recs.map(item => item.timeStamp).reduce((a, b) => a > b ? a : b)
    }
    let domains = new Set(tmp)
    for (const domain of domains) {
        let filteredRecs = recs.filter(u => getDomainFromUrl(u.url) == domain)
        let tmpids = filteredRecs.map(u => u.requestID)
        let ids = new Set(tmpids)
        for (const id of ids) {
            let pair = filteredRecs.filter(u => u.requestID == id)
            let detail = getDetailsFromPair(pair, latest)
            if (st.hasOwnProperty(domain)) {
                st[domain].push(detail)
            } else {
                st[domain] = [detail]
            }
        }
    }
    return st
}



function getDetailsFromPair(recs: RawRecord[], current: number): RequestDetails {
    let size = recs.length
    if (size == 0) {
        return {
            requestID: -1,
            url: 'empty',
            timeSpent: -1,
            resultStatus: 'error'
        }
    } else if (size == 1) {
        let rec = recs[0]
        return {
            requestID: Number(rec.requestID),
            url: rec.url,
            timeSpent: current - rec.timeStamp,
            resultStatus: 'error',
            comments: recs
        }
    } else if (size == 2) {
        let id = recs[0].requestID
        let tmp = recs[0].timeStamp - recs[1].timeStamp
        let time = tmp < 0 ? -tmp : tmp
        let codes = recs.map(u => u.statusCode).filter(u => u != undefined && u > 400) as number[]
        let err = codes.length > 1
        if (err) {
            return {
                requestID: Number(id),
                url: recs[0].url,
                timeSpent: time,
                resultStatus: 'error',
                comments: recs
            }
        } else return {
            requestID: Number(id),
            url: recs[0].url,
            timeSpent: time,
            resultStatus: 'success'
        }
    } else {
        let id = recs[0].requestID
        return {
            requestID: Number(id),
            url: recs[0].url,
            timeSpent: -1,
            resultStatus: 'error',
            comments: recs
        }
    }
}

function printDetails(detail: RequestDetails) {
    return `${detail.requestID}: \n\t${detail.timeSpent}\t${detail.resultStatus} \n\t${detail.url}\n`
}

export function sortDomains(list: string[]) {
    return list.sort((a, b) => {
        let fst = a.split('.').reverse()
        let scd = b.split('.').reverse()
        while (fst.length <= 8) {
            fst.push('')
        }
        while (scd.length <= 8) {
            scd.push('')
        }
        fst.reverse()
        scd.reverse()
        let res = 0
        let cur = 1
        for (let u = 0; u <= 8; u++) {
            res += fst[u].localeCompare(scd[u]) * cur
            cur *= 2
        }
        return res
    })
}

export function getColorFromDelay(delay: number) {
    let begin = { R: 20, G: 240, B: 160 }
    let end = { R: 240, G: 60, B: 40 }
    let space = { R: end.R - begin.R, G: end.G - begin.G, B: end.B - begin.B }
    let gap = delay / 1000000 / 5
    if (gap > 1) {
        gap = 1
    } else if (gap < 0) {
        gap = 0
    }
    let res = { R: begin.R + space.R * gap, G: begin.G + space.G * gap, B: begin.B + space.B * gap }
    return `#${(Number(res.R.toFixed())).toString(16)}${(Number(res.G.toFixed())).toString(16)}${(Number(res.B.toFixed())).toString(16)}`
}

export function isMatched(long: string, short: string) {
    let shs = short.split('.')
    let los = long.split('.')
    while (shs.length >= 1 && los.length >= 1) {
        let a = shs.pop()
        let b = los.pop()
        if (a != b) {
            return false
        }
    }
    if (shs.length > 0) {
        return false
    } else {
        return true
    }
}

export function getUpdatedDict(pre: StringIndexable<string>, newKeys: string[]) {
    let res = pre
    let preKeys = Object.keys(pre)
    let added = newKeys.filter(x => !preKeys.includes(x))
    let deleted = preKeys.filter(x => !newKeys.includes(x))
    for (const u of deleted) {
        delete res[u]
    }
    for (const u of added) {
        res[u] = u
    }
    return res
}

export function sendMessageToV2Ray(mess: any) {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE) {
            console.log(req.responseText)
        }
    }
    req.open('post', 'http://localhost:12321')
    req.send(mess)
}