import React from "react";
import Field from "./Field/Field";

export default function Fields({ fields,formik }) {

  const formFields = fields.map((field, i) => <Field 
  formik={formik} key={i} 
  field={field} />);

  
  return formFields;
}
