import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Path } from "../../types/Path";
import { selectUser } from "../../app/features/user/userSlice";

const AuthRequired: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectUser);
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
