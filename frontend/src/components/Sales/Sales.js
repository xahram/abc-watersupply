import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { DenseTable } from "../DataTable/DataTable";
import { getAllSales } from "../../actions/saleAction";

const dtSaleColumn = [
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
  table: {
    minWidth: 650,
  },
}));

export default function Payments() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state);
  const { salesList } = sales;

  React.useEffect(() => {
    dispatch(getAllSales());
  }, []);

  const dtSaleRows = salesList.map((sale) => ({
    paid: sale.paid,
    dueAmount: sale.dueAmount ? sale.dueAmount : 0,
    paymentTime: sale.paymentTime,
  }));

  return (
    <div className={classes.root}>
      <Typography color="primary" className={classes.heading} variant="h3">
        Recent Sales
      </Typography>
      <DenseTable
        pagination={true}
        columns={dtSaleColumn}
        rows={dtSaleRows}
      />
      <Divider />
    </div>
  );
}
