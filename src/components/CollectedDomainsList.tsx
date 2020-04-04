import React from "react";
import { DomainStatistics } from "../DataTypes";
import { sortDomains, isMatched } from '../options'
import { CollectedDomainItem } from "./CollectedDomainItem";

type CollectedDomainsListProps = {
    domainStatistics: DomainStatistics
    pac: string[]
    onListChanged: (s: Set<string>) => void
}

export class CollectedDomainsList extends React.Component<CollectedDomainsListProps, {}> {

    private domains: string[]
    private checkedDomains: Set<string>

    constructor(props: Readonly<CollectedDomainsListProps>) {
        super(props)
        console.log(this.props.domainStatistics)
        let tmp = [] as string[]
        for (const key in this.props.domainStatistics) {
            if (this.props.domainStatistics.hasOwnProperty(key)) {
                tmp.push(key)
            }
        }
        this.domains = sortDomains(tmp)
        this.checkedDomains = new Set<string>()
    }

    private isDominMatchedInPac(domain: string) {
        for (const i of this.props.pac) {
            if (isMatched(domain, i)) {
                return true
            }
        }
        return false
    }

    render() {
        return (
            this.domains.map((u, i) =>
                <CollectedDomainItem
                    onItemChanged={(n, b) => {
                        if (b) {
                            this.checkedDomains.add(this.domains[n])
                        } else {
                            this.checkedDomains.delete(this.domains[n])
                        }
                        this.props.onListChanged(this.checkedDomains)
                        console.log(this.checkedDomains)
                    }}
                    disabled={this.isDominMatchedInPac(u)}
                    itemID={i}
                    domain={u}
                    requests={this.props.domainStatistics[u]}
                />)
        )
    }
}