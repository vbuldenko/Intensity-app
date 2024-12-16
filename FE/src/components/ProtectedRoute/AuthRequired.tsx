import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../app/features/auth/authSlice";
import { Path } from "../../types/Path";

const AuthRequired: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={Path.Login}
      replace
      state={{
        message: "You must log in first",
        from: location.pathname,
      }}
    />
  );
};

export default AuthRequired;
