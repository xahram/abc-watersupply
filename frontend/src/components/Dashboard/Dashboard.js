import React, { lazy } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
// import Customer from "../Customer/Customer";
import NestedRoutes from "../../routes/NestedRoutes";
import { useRouteMatch, useHistory } from "react-router-dom";

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
  const match = useRouteMatch();
  const history = useHistory();

  const routesConfig = React.useMemo(
    () => [
      {
        exact: true,
        path: match.url + "/customers",
        component: lazy(() => import("../Customer/Customer")),
      },
    ],
    []
  );

  React.useEffect(() => {
    document.title = "Dashboard";
  }, []);
  return (
    <div className={classes.root}>
      <Sidebar />
      <section className={classes.mainSection}>
        <NestedRoutes routesConfig={routesConfig} />
        {/* <Customer /> */}
      </section>
    </div>
  );
}
