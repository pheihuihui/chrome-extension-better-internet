import { ExpansionPanel, ExpansionPanelSummary, FormControlLabel, Checkbox, ExpansionPanelDetails, Typography, withStyles, Button, Paper, rgbToHex } from "@material-ui/core";
import React from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CollectedUrlItem } from "./CollectedUrlItem"
import { RequestDetails } from "../DataTypes";
import color from "@material-ui/core/colors/amber";
import { getColorFromDelay } from "../options";
import { CollectedDomainsList } from "./CollectedDomainsList";
import { CollectedUrlsList } from "./CollectedUrlsList";

type CollectedDomainItemProps = {
    domain: string,
    requests: RequestDetails[],
    disabled: boolean,
    itemID: number,
    onItemChanged: (n: number, checked: boolean) => void
}

export class CollectedDomainItem extends React.Component<CollectedDomainItemProps, {}> {

    private everageLoadTime: number

    constructor(props: Readonly<CollectedDomainItemProps>) {
        super(props)
        let tmp = this.props.requests?.filter(u => u.timeSpent != 0)?.map(u => u.timeSpent)
        this.everageLoadTime = tmp?.reduce((pre, cur, index) => {
            let a = pre * index
            let b = a + cur
            return (b / (index + 1))
        }, 0)
    }

    render() {
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary>
                    <Button style={{ background: getColorFromDelay(this.everageLoadTime) }}>{(this.everageLoadTime / 1000000).toFixed(2)}s</Button>
                    <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        control={<Checkbox
                            color={this.props.disabled ? 'primary' : 'secondary'}
                            //checked={this.props.disabled}
                            disabled={this.props.disabled}
                            onChange={e => { this.props.onItemChanged(this.props.itemID, e.target.checked) }}
                        />}
                        label={this.props.domain}
                    />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                    <CollectedUrlsList details={this.props.requests} />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

}


// export let myDomainItem = <CollectedDomainItem />