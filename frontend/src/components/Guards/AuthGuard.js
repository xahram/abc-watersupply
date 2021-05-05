import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

function AuthGuard({ children }) {
  const auth = useSelector((state) => state.auth);

  console.log(auth)
  if (!auth.isAuthenticated) return <Redirect to="/login" />;

  return children;
}

export default AuthGuard;
