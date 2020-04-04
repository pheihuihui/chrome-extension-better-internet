import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core"
import React from "react"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { RequestDetails, RawRecord } from "../DataTypes"
import { myRequestInfosItem, RequestInfosItem } from "./RequestInfosItem"

type CollectedUrlItemProps = {
    detail: RequestDetails
}

export class CollectedUrlItem extends React.Component<CollectedUrlItemProps, {}> {

    private hasError: boolean

    constructor(props: Readonly<CollectedUrlItemProps>) {
        super(props)
        this.hasError = this.props.detail.resultStatus == 'error'
    }

    render() {
        return (
            <ExpansionPanel disabled={!this.hasError} style={{ flexDirection: 'column' }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography style={{ width: 500 }}>{this.props.detail.url}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                    {this.hasError ? <RequestInfosItem records={this.props.detail.comments!} /> : null}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export let myColl = <CollectedUrlItem detail={{
    requestID: 12,
    url: 'www.sss.com',
    timeSpent: 1243123,
    resultStatus: 'error',
    comments: []
}} />