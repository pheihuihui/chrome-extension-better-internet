import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { DomainList } from './lists/DomainList'
import { Settings } from './Settings'
import SaveIcon from '@material-ui/icons/Save';
import { TinySchema } from '../Analyzor/DB'
import { DomainPropsType } from './SingleDomainItem'
import { CustomRules } from './lists/CustomRules'

interface TabPanelProps {
    children?: React.ReactNode
    index: any
    value: any
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography component="div" role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`}     {...other} >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    )
}

function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    }
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 700,
        width: 1200
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`
    },
    tab: {
        label: { textAlign: 'right' }
    }
}))

export const VerticalTabs = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    }

    return (
        <div className={classes.root}>
            <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange} className={classes.tabs} >
                <Tab label="Recent" />
                <Tab label="Custom Rules" />
                <Tab label="White List" />
                <Tab label="GFW Pac Rules" />
                <Tab label="Personal Pac List" />
                <Tab label="Blocked List" />
                <Tab label="Ignored List" />
                <Tab label="Settings" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <DomainList />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CustomRules />
            </TabPanel>
            <TabPanel value={value} index={2}>

            </TabPanel>
            <TabPanel value={value} index={3}>

            </TabPanel>
            <TabPanel value={value} index={4}>

            </TabPanel>
            <TabPanel value={value} index={5}>

            </TabPanel>
            <TabPanel value={value} index={6}>

            </TabPanel>
            <TabPanel value={value} index={7}>
                <Settings />
            </TabPanel>
            <Fab color="primary" aria-label="add" style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
                <SaveIcon />
            </Fab>
        </div>
    )
}

export const vt = <VerticalTabs />

export const TinySchemaToArray: (s: TinySchema, itemHasMenu: boolean) => DomainPropsType[] = (sch: TinySchema, itemHasMenu: boolean) => {
    let res = [] as DomainPropsType[]
    for (const key in sch) {
        if (sch.hasOwnProperty(key)) {
            const element = sch[key];
            res.push({
                lastRequestTime: element.latestAccess,
                domain: key,
                everageTimeCost: element.everageTimeCost,
                requestCount: element.frequency,
                hasMenu: itemHasMenu
            })
        }
    }
    return res
}