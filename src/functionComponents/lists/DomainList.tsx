import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { SingleDomainItem } from '../SingleDomainItem';
import { testDomains } from '../../test';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 700,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export const DomainList = () => {
  const classes = useStyles()
  //const [checked, setChecked] = React.useState([0])
  const [domains, setDomains] = useState(testDomains)

  // const handleToggle = (value: number) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex == -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1)
  //   }

  //   setChecked(newChecked)
  // }

  return (
    <List className={classes.root}>
      {domains.map(x =>
        <SingleDomainItem domain={x.domain} requestCount={x.requestCount} everageTimeCost={x.everageTimeCost} lastRequestTime={x.lastRequestTime} hasMenu={x.hasMenu} />)}
    </List>
  )
}