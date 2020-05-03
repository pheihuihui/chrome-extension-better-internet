import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add'
import { globalCustomRules } from '../options';

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

export function CustomRuleForm() {
    const classes = useStyles();
    const [rule, setRule] = useState('')
    const handleRule = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRule(e.target.value)
    }

    return (
        <Paper
            component="form"
            className={classes.root}
        >
            <InputBase
                className={classes.input}
                placeholder="input your rule"
                onChange={handleRule}
            />
            <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={(e) => {
                    e.preventDefault()
                    if (!globalCustomRules[rule]) {
                        globalCustomRules[rule] = {
                            latestAccess: Date.now(),
                            frequency: 1,
                            everageTimeCost: 0
                        }
                    }
                    chrome.storage.local.set({ 'customRules': globalCustomRules })
                }}
            >
                <AddIcon />
            </IconButton>
        </Paper>
    )
}

