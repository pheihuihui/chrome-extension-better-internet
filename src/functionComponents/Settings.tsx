import React, { useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { LogType, logTypesNames, globalSettings } from '../options';
import { AddressForm } from './AddressForm';
import { CustomRuleForm } from './CustomRuleForm';

// const globalProps: { [logType in LogType]: boolean } = {
//     beforeRequest: false,
//     beforeSendHeaders: true,
//     sendHeaders: true,
//     headersReceived: false,
//     authRequired: true,
//     beforeRedirect: true,
//     responseStarted: true,
//     errored: false,
//     completed: true
// }

export function Settings() {
    const [state, setState] = React.useState({
        beforeRequest: globalSettings.onBeforeRequest,
        errored: globalSettings.onErrorOccurred,
        completed: globalSettings.onCompleted,
        serverAddress: globalSettings.serverAddress
    })

    // useEffect(() => {
    //     const tt = Object.values(state).map(x => { if (x) { return '1' } else { return '0' } }).join('')
    //     document.title = tt
    // })

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked })
    }

    useEffect(() => {
        globalSettings.onBeforeRequest = state['beforeRequest']
        globalSettings.onCompleted = state['completed']
        globalSettings.onErrorOccurred = state['errored']
        globalSettings.serverAddress = state['serverAddress']
    })

    return (
        <div>
            <FormGroup>
                {
                    (['beforeRequest', 'errored', 'completed'] as const)
                        .map(x => <FormControlLabel control={<Switch checked={state[x]} onChange={handleToggle} name={x} />} label={x} />)
                }
            </FormGroup>
            <br />
            <br />
            <br />
            <div>V2Ray Address</div>
            <AddressForm />
            <br />
            <br />
            <br />
            <div>Custom Rule</div>
            <CustomRuleForm />
        </div>
    )
}

export const optionSwitches = <Settings />