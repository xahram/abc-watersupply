import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";


import Paper from "@material-ui/core/Paper";
import { Divider } from "@material-ui/core";

import { useSelector } from "react-redux";
import {DenseTable} from '../DataTable/DataTable' 

const dtRolesColumn = [{ id: "role", label: "Roles", minWidth: 100 }];
const dtRateListColumn = [
  { id: "size", label: "Bottle Size", minWidth: 100 },
  { id: "price", label: "Total Price", minWidth: 100 },
];
const dtSubscriptionColumn = [
  { id: "name", label: "Type", minWidth: 100 },
  { id: "days", label: "Days", minWidth: 100 },
  { id: "price", label: "Total Price", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper:{
      margin: theme.spacing(1)
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    // flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "left",
    paddingLeft: theme.spacing(1),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
  table: {
    minWidth: 650,
  },
}));

export default function Utilities() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { ratelist, roles, subscriptions } = useSelector(
    (state) => state.utilities
  );

  const dtRolesRows = roles.map((rl) => ({
    role: rl,
  }));

  const dtRateListRows = ratelist.map((rl) => ({
    size: rl.size,
    price: rl.size,
  }));
  const dtSubscriptionRows = subscriptions.map((sb) => ({
    name: sb.name,
    price: sb.price,
    days: sb.days,
  }));

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography color="secondary" className={classes.heading} variant="h2">
          Roles
        </Typography>
        <DenseTable columns={dtRolesColumn} rows={dtRolesRows} />
      </Paper>
      <Divider />

      <Paper className={classes.paper}>
        <Typography color="secondary" className={classes.heading} variant="h2">
          Available Bottle Sizes
        </Typography>
        <DenseTable columns={dtRateListColumn} rows={dtRateListRows} />
      </Paper>
      <Divider />

      <Paper className={classes.paper}>
        <Typography color="secondary" className={classes.heading} variant="h2">
          Subscriptions
        </Typography>
        <DenseTable color="secondary" columns={dtSubscriptionColumn} rows={dtSubscriptionRows} />
      </Paper>
      <Divider />
    </div>
  );
}


