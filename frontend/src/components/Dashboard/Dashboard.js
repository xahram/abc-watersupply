import React, { lazy } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
// import Customer from "../Customer/Customer";
import NestedRoutes from "../../routes/NestedRoutes";
import { useRouteMatch, useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    width: "100%",
    marginLeft: "16rem",
    marginTop: "5rem",
    boxShadow: "2px #fafafa",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "1rem",
    },
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
      {
        exact: true,
        path: match.url + "/deliveries",
        component: lazy(() => import("../Deliveries/Deliveries")),
      },
      {
        exact: true,
        path: match.url + "/sales",
        component: lazy(() => import("../Sales/Sales")),
      },
      {
        exact: true,
        path: match.url + "/utilities",
        component: lazy(() => import("../Utilities/Utilities")),
      },
      {
        exact: true,
        path: match.url + "/payments",
        component: lazy(() => import("../Payments/Payments")),
      },
      {
        exact: true,
        path: match.url + "/logout",
        component: lazy(() => import("../Logout/Logout")),
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
      <Paper className={classes.mainSection}>
        <NestedRoutes routesConfig={routesConfig} />
        {/* <Customer /> */}
      </Paper>
    </div>
  );
}
