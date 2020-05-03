import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import { globalSettings } from '../options';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

export function AddressForm() {
    const classes = useStyles();
    const [address, setAddress] = useState(globalSettings.serverAddress ?? '')
    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value)
        globalSettings.serverAddress = e.target.value
    }

    return (
        <Paper
            component="form"
            className={classes.root}
        >
            <InputBase
                className={classes.input}
                value={address}
                placeholder="server address"
                onChange={handleForm}
            />
            <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={() => {
                    chrome.storage.local.set({ 'settings': globalSettings })
                }}
            >
                <CheckIcon />
            </IconButton>
        </Paper>
    )
}

