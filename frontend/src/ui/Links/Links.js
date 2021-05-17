import { NavLink } from "react-router-dom";

// <NavLink to="/dashboard/customers">Customers</NavLink>,
// // <NavLink to="/dashboard/deliveries">DELIVERIES</NavLink>,
// <NavLink to="/dashboard/payments">Payments</NavLink>,
// <NavLink to="/dashboard/sales">Sales</NavLink>,
// <NavLink to="/dashboard/utilities">Utilities</NavLink>,

// use links array with each object containing following config

export function Links() {
  return [
    { name: "Customers", address: "/dashboard/customers" },
    { name: "Payments", address: "/dashboard/payments" },
    { name: "Sales", address: "/dashboard/sales" },
    { name: "Utilities", address: "/dashboard/utilities" },
  ];
}

export function Links_2() {
  return [
    // <NavLink to="/dashboard/settings">Settings</NavLink>,
    // <NavLink to="/dashboard/logout">Logout</NavLink>,
    { name: "Settings", address: "/dashboard/settings" },
    { name: "Logout", address: "/dashboard/logout" },
  ];
}
