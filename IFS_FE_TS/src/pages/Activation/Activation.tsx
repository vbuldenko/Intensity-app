import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../features/notification/notificationSlice";
import { activate } from "../../features/auth/authThunk";
import { selectAuth } from "../../features/auth/authSlice";
import Loader from "../../components/Elements/Loader";
import { NavLinks } from "../../types/NavLinks";

type Params = {
  activationToken?: string;
};

const AccountActivation = () => {
  // Get activation token from URL parameters
  // const { activationToken } = useParams<Params>();
  const activationToken = null;
  const notification = useAppSelector(selectNotification);
  const { isAuthenticated, loading, error } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activationToken) {
      dispatch(notifyWith("Activation token is missing."));
      return;
    }

    dispatch(activate(activationToken));
  }, [activationToken]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="title">Account activation</h1>

      {error ? (
        <p className="notification is-danger is-light">{error}</p>
      ) : (
        <Navigate to={`/${NavLinks.Account}`} replace />
      )}
    </div>
  );
};

export default AccountActivation;
