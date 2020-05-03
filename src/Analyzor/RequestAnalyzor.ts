import { TinyDB, PendingContent } from "./DB";

export type RequestState = 'start' | 'complete' | 'error'

export class RequestAnalyzor {

    private db?: TinyDB
    private buffer: {
        [id: string]: {
            timestamp: number
            url: string
            state: RequestState
            returnedCode?: number
        }
    }

    constructor(tdb: TinyDB) {
        this.db = tdb
        this.buffer = {}
    }

    public accept_onBeforeRequest(detail: chrome.webRequest.WebRequestBodyDetails) {
        this.buffer[detail.requestId] = {
            timestamp: detail.timeStamp,
            url: detail.url,
            state: 'start'
        }
    }

    public accept_onErrorOccurred(detail: chrome.webRequest.WebResponseErrorDetails) {
        let _id = detail.requestId
        let stt = this.buffer[_id]?.timestamp
        let end = detail.timeStamp
        this.insertNewRecordToDB(detail.url, stt, end, 'error', detail.statusCode)
        delete this.buffer[detail.requestId]
    }

    public accept_onCompleted(detail: chrome.webRequest.WebResponseCacheDetails) {
        let _id = detail.requestId
        let stt = this.buffer[_id]?.timestamp
        let end = detail.timeStamp
        this.insertNewRecordToDB(detail.url, stt, end, 'complete', detail.statusCode)
        delete this.buffer[detail.requestId]
    }

    private insertNewRecordToDB(url: string, timestamp_start: number, timestamp_end: number, outcome: 'complete' | 'error', code: number) {
        let last = timestamp_start
        let timeCost = timestamp_end - timestamp_start
        this.db?.insertNewRecord(url, timeCost, last, outcome, code)
    }

    public refreshPendingList() {
        let time = Date.now()
        let list = [] as PendingContent[]
        for (const key in this.buffer) {
            if (this.buffer.hasOwnProperty(key)) {
                const element = this.buffer[key];
                list.push({ url: element.url, timeCost: time - element.timestamp })
            }
        }
        this.db?.setPendingList(list)
    }
}


export function setIntervalX(callback: () => void, delay: number, repetitions: number) {
    var x = 0
    var intervalID = window.setInterval(function () {
        callback()
        x += 1
        if (x == repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay)
}

// chrome.webRequest.onAuthRequired.addListener
// chrome.webRequest.onBeforeRedirect.addListener
// chrome.webRequest.onBeforeRequest.addListener
// chrome.webRequest.onBeforeSendHeaders.addListener
// chrome.webRequest.onCompleted.addListener
// chrome.webRequest.onErrorOccurred.addListener
// chrome.webRequest.onHeadersReceived.addListener
// chrome.webRequest.onResponseStarted.addListener
// chrome.webRequest.onSendHeaders.addListener
