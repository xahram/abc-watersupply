import React from "react";
import { TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddForm({ fields, formik }) {
  const addform = fields.map((field) => (
    <TextField
      key={field[0]}
      variant="outlined"
      margin="normal"
      required
      fullWidth
      error={formik.touched[field[0]] && formik.errors[field[0]] ? true : false}
      helperText={formik.errors[field[0]]}
      id={field[0]}
      label={`${field[0]}`}
      name={field[0]}
      autoComplete={field[0]}
      autoFocus
      value={formik.values[field[0]]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
  ));
  {
    /* {formik.touched[field[0]] && formik.errors[field[0]] ? (
        <div>{formik.errors[field[0]]}</div>
      ) : null} */
  }
  return addform;
}
