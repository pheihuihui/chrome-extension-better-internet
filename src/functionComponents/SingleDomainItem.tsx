import React from "react"
import { ListItem, ListItemText, Button, Menu, MenuItem, Divider } from "@material-ui/core"
import SendIcon from '@material-ui/icons/Send'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { green } from "@material-ui/core/colors"

export interface DomainPropsType {
    domain: string,
    requestCount: number,
    everageTimeCost: number,
    lastRequestTime: number,
    hasMenu?: boolean
}

export const SingleDomainItem = (props: DomainPropsType) => {
    const [anchorEl_option, setAnchorEl_option] = React.useState<null | HTMLElement>(null);
    const [anchorEl_info, setAnchorEl_info] = React.useState<null | HTMLElement>(null);
    const handleClick_option = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl_option(event.currentTarget)
    }
    const handleClick_info = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl_info(event.currentTarget);
    }
    const handleClose_option = () => {
        setAnchorEl_option(null)
    }
    const handleClose_info = () => {
        setAnchorEl_info(null)
    }
    const handleAlert_info = () => {
        console.log('hi')
        setAnchorEl_info(null)
    }
    return (
        <ListItem>
            <ListItemText primary={props.domain} style={{ textAlign: 'left', width: 400, flex: 'left' }} />
            {/* <Divider orientation={'vertical'} style={{color: 'red'}}/> */}
            <ListItemText primary={props.everageTimeCost.toString() + 's'} style={{ background: 'green', width: 100, flex: 'right' }} />
            <ListItemText primary={props.lastRequestTime.toString()} style={{ width: 100, flex: 'right' }} />
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick_info}>
                <LocalLibraryIcon />
            </Button>
            <Menu id="simple-menu" anchorEl={anchorEl_info} keepMounted open={Boolean(anchorEl_info)} onClose={handleClose_info}>
                <MenuItem onClick={handleAlert_info}>Details</MenuItem>
                <MenuItem onClick={handleClose_info}>History</MenuItem>
            </Menu>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick_option} disabled={!props.hasMenu}>
                <SendIcon />
            </Button>
            <Menu id="simple-menu" anchorEl={anchorEl_option} keepMounted open={Boolean(anchorEl_option)} onClose={handleClose_option}>
                <MenuItem onClick={handleClose_option}>Personal</MenuItem>
                <MenuItem onClick={handleClose_option}>Block</MenuItem>
                <MenuItem onClick={handleClose_option}>Ignore</MenuItem>
                <MenuItem onClick={handleClose_option}>Remove</MenuItem>
            </Menu>
            <Button onClick={() => { }} >
                <FileCopyIcon />
            </Button>
        </ListItem>
    )
}
