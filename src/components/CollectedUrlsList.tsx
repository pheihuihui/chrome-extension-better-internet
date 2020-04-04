import React from "react";
import { RequestDetails } from "../DataTypes";
import { CollectedUrlItem } from "./CollectedUrlItem";

type CollectedUrlsListProps = {
    details: Array<RequestDetails>
}

export class CollectedUrlsList extends React.Component<CollectedUrlsListProps, {}> {
    render() {
        return (
            this.props.details.map((u, i) =>
                <CollectedUrlItem
                    key={i}
                    detail={{
                        requestID: u.requestID,
                        url: u.url,
                        timeSpent: u.timeSpent,
                        resultStatus: u.resultStatus,
                        comments: u.comments
                    }}
                />
            )
        )
    }
}