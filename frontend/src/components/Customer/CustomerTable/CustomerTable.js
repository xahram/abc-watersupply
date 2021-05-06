import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { Typography } from "@material-ui/core";
import CustomerInfo from "../CustomerInfo/CustomerInfo";
import Skeleton from 'react-loading-skeleton';

const columns = [
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

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: "2rem",
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable({ customers, handleOpen , loading }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const updatedUser = customers.map((user) => ({
    name: user.name,
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
  const rows = updatedUser;

  const customerTable = loading ? <Skeleton width="100%" height="100%" count={1}/> : (
    <Paper elevation={7} className={classes.root}>
      <Typography align="left" variant="h2" color="primary">
        Users
      </Typography>
      <TableContainer className={classes.container}>
        <Table
          //   size="small"
          //   aria-label="a dense table"
          stickyHeader
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
  return customerTable
}
