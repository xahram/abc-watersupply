import React from "react";
import Edit from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import {
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  TextField,
} from "@material-ui/core";

export default function Field({ field, formik }) {
  const [toggle, setToggle] = React.useState(false);
  const onCancelHandler = () => {
    setToggle(!toggle);
    formik.values[field] = formik.initialValues[field];
  };
  const onDoneHandler = () => {
    setToggle(!toggle);
  };
  const onEditHandler = (e) => {
    e.stopPropagation()
    setToggle(!toggle);
  };
  return toggle ? (
    <>
      <ListItem>
        <TextField
          value={formik.values[field]}
          name={field}
          id={field}
          label={field}
          fullWidth
          onChange={formik.handleChange}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={onDoneHandler}>
            <DoneIcon></DoneIcon>
          </IconButton>
          <IconButton onClick={onCancelHandler}>
            <CancelIcon></CancelIcon>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  ) : (
    <>
      <ListItem>
        <ListItemText>{formik.values[field]}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton onClick={onEditHandler}>
            <Edit></Edit>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
}
