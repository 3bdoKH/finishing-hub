import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ requiredRole }) => {
  const { currentUser, loading } = useAuth();

  // If auth is still loading, show loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login/company" />;
  }

  // If requiredRole is specified and user role doesn't match, redirect to appropriate page
  if (requiredRole && currentUser.role !== requiredRole) {
    if (currentUser.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/company/dashboard" />;
    }
  }

  // User is authenticated and has required role, render children
  return <Outlet />;
};

export default PrivateRoute;
