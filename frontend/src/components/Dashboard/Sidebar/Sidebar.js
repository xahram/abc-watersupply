import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Divider from "@material-ui/core/Divider";
import List from "../../../ui/List/List";
import Paper from "@material-ui/core/Paper";
import { Links , Links_2} from "../../../ui/Links/Links";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      position: "fixed",
      marginTop:"3rem"
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
  const SIDEBAR_ITEMS_2 = React.useMemo(Links_2, []);

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
