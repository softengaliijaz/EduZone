import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRouteWrapper = () => {
  const { user, isInitializing } = useSelector((state) => state.auth);

  if (isInitializing) {
    return <div className="route-loading" role="status">Checking your account…</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRouteWrapper;
