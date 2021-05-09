import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Divider from "@material-ui/core/Divider";
import List from "../../../layout/List/List";
import Paper from "@material-ui/core/Paper";
import { Links } from "../../../layout/Links/Links";
import { SIDEBAR_ITEMS_2 } from "../../../config/index";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,

    //Custom clsses
    height: "90vh",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const SIDEBAR_ITEMS_1 = React.useMemo(Links, []);

  return (
    <div className={classes.root}>
      <Paper
        elevation={10}
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List list={SIDEBAR_ITEMS_1}></List>
        <Divider />
        <List list={SIDEBAR_ITEMS_2}></List>
      </Paper>
    </div>
  );
}
