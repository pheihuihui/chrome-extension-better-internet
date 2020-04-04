import { RawRecord, ButtonState } from "./DataTypes";

chrome.runtime.onInstalled.addListener(function () {
    //chrome.runtime.onMessage.addListener((mess, sender, resp) => { alert(mess) })
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                //pageUrl: { hostEquals: 'developer.chrome.com' },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
    chrome.storage.local.set({ 'pac': [] })
    chrome.storage.local.set({ 'collected': [] })
    chrome.storage.local.set({ 'state': 'ready' })
    chrome.webRequest.onBeforeRequest.addListener(listn_req, { urls: [] }, [])
    chrome.webRequest.onCompleted.addListener(listn_comp, { urls: [] }, [])
    chrome.webRequest.onErrorOccurred.addListener(listn_err, { urls: [] }, [])
    chrome.runtime.onConnect.addListener(() => {
        console.log('connect')
    })
});

let listn_req = (req: chrome.webRequest.WebRequestBodyDetails) => {
    let st = chrome.storage.local.get(items => {
        let cur = items['state'] as ButtonState
        let collected = items['collected'] as RawRecord[]
        if (cur == 'collecting') {
            console.log('req')
            console.log(req)
            collected.push({
                requestID: req.requestId,
                recordType: 'start',
                url: req.url,
                timeStamp: req.timeStamp
            })
            chrome.storage.local.set({ 'collected': collected })
            console.log('')
        }
    })
}

let listn_comp = (detail: chrome.webRequest.WebResponseCacheDetails) => {
    let st = chrome.storage.local.get(items => {
        let cur = items['state'] as ButtonState
        let collected = items['collected'] as RawRecord[]
        if (cur == 'collecting') {
            console.log('complete')
            console.log(detail)
            collected.push({
                requestID: detail.requestId,
                recordType: 'complete',
                url: detail.url,
                timeStamp: detail.timeStamp,
                statusCode: detail.statusCode
            })
            chrome.storage.local.set({ 'collected': collected })
            console.log('')
        }
    })
}

let listn_err = (detail: chrome.webRequest.WebResponseErrorDetails) => {
    let st = chrome.storage.local.get(items => {
        let cur = items['state'] as ButtonState
        let collected = items['collected'] as RawRecord[]
        if (cur == 'collecting') {
            console.log('error')
            console.log(detail)
            collected.push({
                requestID: detail.requestId,
                recordType: 'error',
                url: detail.url,
                timeStamp: detail.timeStamp,
                statusCode: detail.statusCode
            })
            chrome.storage.local.set({ 'collected': collected })
            console.log('')
        }
    })
}