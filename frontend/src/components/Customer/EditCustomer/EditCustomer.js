import React from "react";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import LoginImage from "../../../assets/images/register.gif";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Fields from "./Fields/Fields";
import { List } from "@material-ui/core";
import {
  updateCustomer,
  getAllCustomers,
} from "../../../actions/customerActions";

const useStyles = makeStyles((theme) => ({
  //   root: {
  //     height: "100vh",
  //   },
  image: {
    backgroundImage: `url(${LoginImage})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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

export default function EditCustomer({ currentUser, handleClose }) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.utilities.roles);

  const formik = useFormik({
    initialValues: {
      name: currentUser.name,
      email: currentUser.email,
      age: currentUser.age,
      role: currentUser.role,
      // password: "",
    },
    onSubmit: async (values) => {
      values.userId = currentUser._id;
      setLoading(true);
      await dispatch(updateCustomer(values));
      await dispatch(getAllCustomers());
      setLoading(false);
      handleClose();
    },

    validationSchema: Yup.object({
      name: Yup.string().max(20, "Must be 20 characters or less"),
      age: Yup.string(),
      email: Yup.string().email("Invalid email address"),
      role: Yup.string(),
    }),
  });

  const formFields = formik.initialValues;
  delete formFields.role;
  delete formFields.userId;
  const fields = Object.keys(formFields);

  return (
    <>
      <Typography component="h1" variant="h2" color="primary" align="left">
        Update User
      </Typography>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <List className={classes.list}>
          <Fields formik={formik} fields={fields}></Fields>
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
        </List>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={Object.entries(formik.errors).length ? true : false}
          className={classes.submit}
        >
          {loading ? (
            <CircularProgress color="secondary" size="1.5rem" />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </>
  );
}
