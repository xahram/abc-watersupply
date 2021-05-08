import React from "react";
import DataTable from "../DataTable/DataTable";
import UserInfo from "../Customer/CustomerInfo/CustomerInfo";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../../actions/customerActions";
import { getAllUtilities } from "../../actions/utilityActions";
import Modal from "../Modal/Modal";
import EditCustomer from "../Customer/EditCustomer/EditCustomer";
import EditIcon from "@material-ui/icons/Edit";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import { getAllPaymentsOfUser } from "../../actions/paymentActions";

const dtAllCustomerPaymentsColumns = [
  { id: "paid", label: "Amount Paid", minWidth: 100 },
  { id: "dueAmount", label: "Due Amount", minWidth: 100 },
  { id: "paymentTime", label: "Payment Time", minWidth: 100 },
];
const dtAllCUstomersListColumns = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "role", label: "Role", minWidth: 100 },
  {
    id: "age",
    label: "Age",
    minWidth: 100,
    align: "right",
  },
  {
    id: "subscription",
    label: "Subscription",
    minWidth: 100,
    align: "right",
  },
  {
    id: "edit",
    label: "Edit",
    minWidth: 100,
    align: "right",
  },
  //   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  //   {
  //     id: 'size',
  //     label: 'Size\u00a0(km\u00b2)',
  //     minWidth: 170,
  //     align: 'right',
  //   },
];

export default function Customer() {
  const [open, setOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const dispatch = useDispatch();
  const { customers, auth, payments } = useSelector((state) => state);

  const handleOpen = (currentUser) => {
    setOpen(true);
    setCurrentUser(currentUser);
  };
  const handlePaymentOpen = (currentUser) => {
    setPaymentOpen(true);
    setCurrentUser(currentUser);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlePaymentClose = () => {
    setPaymentOpen(false);
  };

  const handleGetAllPayments = async (e, id) => {
    e.preventDefault();
    await dispatch(getAllPaymentsOfUser(id));
    handlePaymentOpen();
    console.log(payments)
    console.log("you click",id)
  };

  const dtCustomerAllPaymentsRows = payments.totalCustomerPayments.map(
    (payment) => ({
      paid: payment.paid,
      dueAmount: payment.dueAmount,
      paymentTime: payment.paymentTime,
    })
  );
  const dtAllCUstomersListRows = customers.customers.map((user) => ({
    name: (
      <Link
        href="#"
        onClick={(e) => handleGetAllPayments(e, user._id)}
        variant="h4"
      >
        {user.name}
      </Link>
    ),
    email: user.email,
    role: user.role,
    age: user.age,
    subscription: user.subscription ? user.subscription : "none",
    edit: (
      <IconButton
        edge="start"
        color="inherit"
        onClick={() => {
          handleOpen(user);
        }}
      >
        <EditIcon />
      </IconButton>
    ),
  }));
  React.useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllUtilities());
  }, []);

  return (
    <>
      <Modal open={open} handleOpen={handleOpen} handleClose={handleClose}>
        <EditCustomer handleClose={handleClose} currentUser={currentUser} />
      </Modal>
      <UserInfo totalCustomers={customers.totalCustomers} user={auth.user} />
      <DataTable
        columns={dtAllCUstomersListColumns}
        rows={dtAllCUstomersListRows}
        loading={false}
      />
      <Modal open={paymentOpen} handleOpen={handlePaymentOpen} handleClose={handlePaymentClose}>
        <DataTable
          columns={dtAllCustomerPaymentsColumns}
          rows={dtCustomerAllPaymentsRows}
        />
      </Modal>
    </>
  );
}
