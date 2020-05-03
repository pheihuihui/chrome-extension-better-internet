import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { SingleDomainItem } from '../SingleDomainItem';
import { testDomains } from '../../test';
import { Divider } from '@material-ui/core';
import { globalCustomRules } from '../../options';
import { TinySchemaToArray } from '../VerticalTabs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 700,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export const CustomRules = () => {
  const classes = useStyles()
  const [rules, setRules] = useState(TinySchemaToArray(globalCustomRules, true))

  return (
    <List className={classes.root}>
      {rules.map(x =>
        <SingleDomainItem domain={x.domain} requestCount={x.requestCount} everageTimeCost={x.everageTimeCost} lastRequestTime={x.lastRequestTime} hasMenu={x.hasMenu} />)}
    </List>
  )
}