import React from "react"
import { RawRecord } from "../DataTypes"

type RequestInfosItemProps = {
    records: RawRecord[]
}

export class RequestInfosItem extends React.Component<RequestInfosItemProps, {}>{
    private printRecord(rec: RawRecord) {
        return `${rec.requestID}:\t${rec.statusCode}\t${rec.timeStamp}\n\t${rec.url}`
    }
    render() {
        return (
            this.props.records.map(u => <div style={{ width: 500 }}>{this.printRecord(u)}</div>)
        )
    }
}

let testProps: RequestInfosItemProps = {
    records: [
        {
            requestID: '12',
            recordType: 'error',
            timeStamp: 1231231,
            url: 'tasdasfaeasf',
            statusCode: 504
        },
        {
            requestID: '12',
            recordType: 'start',
            timeStamp: 345234,
            url: 'tasdasfaeasf'
        }
    ]
}
export let myRequestInfosItem = <RequestInfosItem records={testProps.records} />