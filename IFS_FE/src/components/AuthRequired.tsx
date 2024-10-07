import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { NavLinks } from "../types/NavLinks";
import { checkAuth } from "../features/auth/authThunk";

const AuthRequired: React.FC = () => {
  const { isAuthenticated, error } = useAppSelector(selectAuth);
  const location = useLocation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated && !error) {
      dispatch(checkAuth());
    }
  }, []);

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
