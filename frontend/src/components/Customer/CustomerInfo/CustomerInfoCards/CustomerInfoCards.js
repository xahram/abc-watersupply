import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: "1rem",
  },
  typography: {
    marginBottom: "1rem",
  },
});

export default function CustomerInfo({ totalCustomers, user }) {
  const classes = useStyles();
  const cards = [
    { name: "Name", value: user.name },
    { name: "Total Users", value: totalCustomers },
    { name: "Role", value: user.role ? user.role : "Admin" },
    { name: "Subscription", value: "none" },
  ].map((card,i) => {
    return (
      <Paper key={i} className={classes.root} elevation={6}>
        <Typography className={classes.typography} variant="h3" align="left">
          {card.name}
        </Typography>
        <Typography
          className={classes.typography}
          variant="h2"
          color="primary"
          align="left"
        >
          {card.value}
        </Typography>
      </Paper>
    );
  });
  return <>{cards}</>;
}
