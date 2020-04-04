import { SelectedDomainItem } from "./SelectedDomainItem";
import React from "react";

type SelectedDomainsListProps = {
    domains: { [original: string]: string }
    onInputsChanged: (dic: { [key: string]: string }) => void
}

type SelectedDomainsListState = {
    modified: { [original: string]: string }
}

export class SelectedDomainsList extends React.Component<SelectedDomainsListProps, SelectedDomainsListState>{


    constructor(props: Readonly<SelectedDomainsListProps>) {
        super(props)
        // this.domainsDic = props.domains.reduce((pre: { [key: number]: string }, cur, ind) => {
        //     pre[ind] = cur
        //     return pre
        // }, {})
        this.state = {
            modified: this.props.domains
        }
    }

    render() {
        let domainKeys = Object.keys(this.props.domains)
        return (domainKeys.map((u, i) =>
            <SelectedDomainItem
                domainName={u}
                key={i}
                anotherKey={i}
                onContentChanged={
                    (c, i) => {
                        let tmp = this.state.modified
                        tmp[i] = c
                        this.setState({ modified: tmp })
                        this.props.onInputsChanged(tmp)
                    }} />
        ))
    }
}
