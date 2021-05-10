import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import { Divider } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { DenseTable } from "../DataTable/DataTable";
import { getAllPayments } from "../../actions/paymentActions";

const dtSubscriptionColumn = [
  { id: "customer", label: "Customer", minWidth: 100 },
  { id: "paid", label: "Paid", minWidth: 100 },
  { id: "dueAmount", label: "Due Amount", minWidth: 100 },
  { id: "paymentTime", label: "Payment Time", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "2rem 0 0 2rem",
  },

  heading: {
    flexShrink: 0,
    textAlign: "left",
    padding: "0 0 2rem 0",
    
},
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
  table: {
    minWidth: 650,
  },
}));

export default function Payments() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state);
  const { allPayments } = payments;

  React.useEffect(() => {
    dispatch(getAllPayments());
  }, []);

  const dtSubscriptionRows = allPayments.map((payment) => ({
    customer: payment.user.name,
    paid: payment.paid,
    dueAmount: payment.dueAmount,
    paymentTime: payment.paymentTime,
  }));

  return (
    <div className={classes.root}>
      <Typography
        color="primary"
        className={classes.heading}
        variant="h3"
      >
        Recent Payments
      </Typography>
      <DenseTable
        pagination={true}
        columns={dtSubscriptionColumn}
        rows={dtSubscriptionRows}
      />
      <Divider />
    </div>
  );
}
