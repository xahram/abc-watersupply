import { NavLink } from "react-router-dom";

export function Links() {
  return [
    <NavLink to="/dashboard/customers">Customers</NavLink>,
    <NavLink to="/dashboard/deliveries">Deliveries</NavLink>,
    <NavLink to="/dashboard/sales">Sales</NavLink>,
    <NavLink to="/dashboard/utilities">Utilities</NavLink>,
  ];
}
