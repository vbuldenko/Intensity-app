import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { NavLinks } from "../../types/NavLinks";

const AuthRequired: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={NavLinks.Login}
      replace
      state={{
        message: "You must log in first",
        from: location.pathname,
      }}
    />
  );
};

export default AuthRequired;
