import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import Customer from "../Customer/Customer";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    width: "100%",
    marginLeft: "1rem",
    marginTop: "3rem",
    boxShadow: "2px #fafafa",
  },
  root: {
    display: "flex",
  },
}));


export default function Dashboard() {
  const classes = useStyles();

  React.useEffect(() => {

    document.title = "Dashboard";
  }, []);
  return (
    <div className={classes.root}>
      <Sidebar />
      <section className={classes.mainSection}>
        <Customer />
      </section>
    </div>
  );
}
