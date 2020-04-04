import { TextField } from "@material-ui/core";
import React from "react";


type SelectedDomainItemProps = {
    anotherKey: number
    domainName: string
    onContentChanged: (val: string, ind: string) => void
}

type SelectedDomainItemState = {
    content: string
}

export class SelectedDomainItem extends React.Component<SelectedDomainItemProps, SelectedDomainItemState> {

    constructor(props: Readonly<SelectedDomainItemProps>) {
        super(props)
        // this.state = {
        //     content: this.props.domainName
        // }
    }

    render() {
        return (
            <TextField
                key={this.props.domainName}
                label={this.props.domainName}
                style={{ margin: 8 }}
                defaultValue={this.props.domainName}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                onChange={e => {
                    this.props.onContentChanged(e.target.value, this.props.domainName)
                }}
            />
        )
    }
}
