import { NavLink } from "react-router-dom";

export function Links() {
  return [
    <NavLink to="/dashboard/customers">Customers</NavLink>,
    // <NavLink to="/dashboard/deliveries">DELIVERIES</NavLink>,
    <NavLink to="/dashboard/payments">Payments</NavLink>,
    <NavLink to="/dashboard/sales">Sales</NavLink>,
    <NavLink to="/dashboard/utilities">Utilities</NavLink>,
  ];
}

export function Links_2() {
  return [
    <NavLink to="/dashboard/settings">Settings</NavLink>,
    <NavLink to="/dashboard/logout">Logout</NavLink>,
  ];
}
