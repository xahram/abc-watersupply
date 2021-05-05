import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));
export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
        <p>loremalshfd laksd flhkaj sdlfkha sdkfjhas ldfh lasdh flas dflka sdlkha dkf alks dfha lskjdh fla sdjfhlksdf hlahdsfl ashdf klahf</p>
    </div>
  );
}
