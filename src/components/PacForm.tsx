import { Grid, Button } from "@material-ui/core";
import React from "react";
import { DomainStatistics } from "../DataTypes";
import { CollectedDomainsList } from "./CollectedDomainsList";
import { SelectedDomainsList } from "./SelectedDomainsList";
import { getUpdatedDict, sendMessageToV2Ray } from "../options";

type PacFormProps = {
    domains: DomainStatistics,
    pac: string[]
    ignored: string[]
}

type PacFormState = {
    modifiedSelected: {
        [originalSelected: string]: string
    }
}

export class PacForm extends React.Component<PacFormProps, PacFormState> {

    constructor(props: Readonly<PacFormProps>) {
        super(props)
        this.state = {
            modifiedSelected: {}
        }
    }

    render() {
        return (
            <Grid container justify="center">

                <Grid key={0} item={false}>
                    <CollectedDomainsList
                        domainStatistics={this.props.domains}
                        pac={this.props.pac}
                        onListChanged={s => {
                            let pre = this.state.modifiedSelected
                            let newKeys = Array.from(s)
                            let cur = getUpdatedDict(pre, newKeys)
                            this.setState({ modifiedSelected: cur })
                            console.log(this.state)
                        }} />
                </Grid>

                <Grid style={{ width: 500 }} key={1} item={true}>
                    {/* <Button variant='contained' color='primary' onClick={() => console.log(this.state.selected)}>Update</Button> */}
                    <Button variant='contained' color='primary' onClick={() => {
                        // chrome.runtime.sendNativeMessage('my.pheihuihui.better_internet', { text: 'hello' }, res => {
                        //     console.log(res)
                        // })
                        sendMessageToV2Ray(Object.values(this.state.modifiedSelected))
                    }}>Update</Button>
                    <SelectedDomainsList
                        domains={this.state.modifiedSelected}
                        onInputsChanged={
                            c => {
                                this.setState({ modifiedSelected: c })
                            }} />
                </Grid>

            </Grid>
        )
    }
}


export function getMyPacForm(st: DomainStatistics, pac: string[], ignored: string[]) {
    return <PacForm domains={st} pac={pac} ignored={ignored}></PacForm>
}
