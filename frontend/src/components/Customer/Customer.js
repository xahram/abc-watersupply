import React from "react";
import CustomerTable from "../Customer/CustomerTable/CustomerTable";
import UserInfo from "../Customer/CustomerInfo/CustomerInfo";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../../actions/customerActions";
import Modal from "../Modal/Modal";
import EditCustomer from "../Customer/EditCustomer/EditCustomer";

export default function Customer() {
  const [open, setOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  const handleOpen = (currentUser) => {
    setOpen(true);
    setCurrentUser(currentUser);
    // console.log(currentUser)
  };

  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const { customers, auth } = useSelector((state) => state);

  React.useEffect(() => {
    dispatch(getAllCustomers());
  }, []);

  return (
    <>
      <Modal open={open} handleOpen={handleOpen} handleClose={handleClose}>
        <EditCustomer currentUser={currentUser}/>
      </Modal>
      <UserInfo totalCustomers={customers.totalCustomers} user={auth.user} />
      <CustomerTable customers={customers.customers} handleOpen={handleOpen} loading={false}/>
    </>
  );
}
