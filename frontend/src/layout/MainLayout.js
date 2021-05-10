import React from "react";
import Navbar from "../ui/Navbar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fbfbfb",
  },
}));

function MainLayout({ children }) {
  const classes = useStyles();
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className={classes.root}>
        {/* <Sidebar /> */}
        {children}
      </main>
      <footer></footer>
    </>
  );
}

export default MainLayout;
