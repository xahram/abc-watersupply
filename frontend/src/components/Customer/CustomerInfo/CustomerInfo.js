import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomerInfoCards from "./CustomerInfoCards/CustomerInfoCards";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      columnGap: "0.5rem",
    },
  },

}));

export default function CustomerInfo(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CustomerInfoCards {...props} />
    </div>
  );
}
