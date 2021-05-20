import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Modal from "../../Modal/Modal";
import AddForm from "../AddForm/AddForm";
import {
  MenuItem,
  Select,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  createCustomer,
  getAllCustomers,
} from "../../../actions/customerActions";
import { useFormik } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
  },
  divPlaceholder: {
    flexGrow: 1,
  },
  selectlabel: {
    marginTop: "1rem",
  },
  list: {
    width: "60vw",
  },
  select: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AddCustomer(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { roles, subscriptions } = useSelector((state) => state.utilities);
  const dispatch = useDispatch();

  const handleOpen = (currentUser) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fields = Object.entries({ email: "", name: "", age: "" });
  let initialValues = {};
  fields.forEach(
    (field) => (initialValues[field[0]] = initialValues[field[1]])
  );
  const formik = useFormik({
    initialValues: { ...initialValues, role: "", subscriptionId: "" },
    onSubmit: async (values) => {
      setLoading(true);
      if (!values.subscriptionId.length) delete values.subscriptionId;

      await dispatch(createCustomer(values));
      await dispatch(getAllCustomers());
      setLoading(false);
      handleClose();
      // alert(JSON.stringify(values));
    },

    validationSchema: () =>
      Yup.lazy((values) =>
        Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          name: Yup.string().required("Required"),
          age: Yup.number().required("Required"),
          role: Yup.string().required("Required"),
          subscriptionId:
            values.role === "CUSTOMER"
              ? Yup.string().required("Customer must have a subscription")
              : Yup.string(),
        })
      ),
  });

  return (
    <Paper className={classes.root}>
      <Modal open={open} handleOpen={handleOpen} handleClose={handleClose}>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <AddForm formik={formik} fields={fields}></AddForm>
          <InputLabel className={classes.selectlabel} id="role-label">
            Roles
          </InputLabel>{" "}
          <Select
            className={classes.select}
            labelId="role-label"
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.role && formik.errors.role ? (
            <div>{formik.errors.role}</div>
          ) : null}
          <InputLabel className={classes.selectlabel} id="role-label">
            Subscriptions
          </InputLabel>{" "}
          <Select
            className={classes.select}
            labelId="role-label"
            id="subscriptionId"
            name="subscriptionId"
            // error={
            //   formik.touched.subscriptionId && formik.errors.subscriptionId
            //     ? true
            //     : false
            // }
            // helperText={formik.errors.subscriptionId}
            value={formik.values.subscriptionId}
            onChange={formik.handleChange}
          >
            <MenuItem value="" primaryText=""></MenuItem>
            {subscriptions.map((sb) => (
              <MenuItem key={sb._id} value={sb._id}>
                {sb.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.subscription && formik.errors.subscription ? (
            <div>{formik.errors.subscription}</div>
          ) : null}
          <Button
            size="md"
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            disabled={Object.entries(formik.errors).length ? true : false}
          >
            {loading ? (
              <CircularProgress color="secondary" size="1.5rem" />
            ) : (
              "Add User"
            )}
          </Button>
        </form>
      </Modal>
      <div className={classes.divPlaceholder}></div>
      <Button
        size="large"
        color="primary"
        variant="contained"
        onClick={handleOpen}
      >
        Add User
      </Button>
    </Paper>
  );
}
