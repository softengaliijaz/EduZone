import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const RoleProtectedRouteWrapper = ({ allowedRoles }) => {
  const { user, isInitializing } = useSelector((state) => state.auth);

  if (isInitializing) {
    return <div className="route-loading" role="status">Loading your workspace…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.user_type) ? (
    <Outlet />
  ) : (
    <Navigate to="/notfound" replace />
  );
};

export default RoleProtectedRouteWrapper;
