import { NavLink } from "react-router-dom";

export function Links() {
  return [
    <NavLink to="/dashboard/customers">CUSTOMERS</NavLink>,
    <NavLink to="/dashboard/deliveries">DELIVERIES</NavLink>,
    <NavLink to="/dashboard/payments">PAYMENTS</NavLink>,
    <NavLink to="/dashboard/sales">SALES</NavLink>,
    <NavLink to="/dashboard/utilities">UTILITIES</NavLink>,
  ];
}
