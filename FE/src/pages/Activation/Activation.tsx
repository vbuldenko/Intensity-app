import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { activate } from "../../features/auth/authThunk";
import { selectAuth } from "../../features/auth/authSlice";
import Loader from "../../components/Elements/Loader";
import { Path } from "../../types/Path";

const AccountActivation = () => {
  const { activationToken } = useParams();
  const { loading, error, isAuthenticated } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (activationToken) {
      dispatch(activate(activationToken))
        .unwrap()
        .then(() => setTimeout(() => setRedirect(true), 5000));
    }
  }, [activationToken, dispatch]);

  if (redirect) return <Navigate to={`/${Path.Account}`} replace />;

  return (
    <div className="card-element p-4 flex flex-col items-center">
      <h1 className="title text-center">Account activation</h1>
      {loading ? (
        <>
          <Loader />
          <p className="bg-gray-100 p-2 rounded-lg mt-4">
            Activation in progress...
          </p>
        </>
      ) : error ? (
        <p className="bg-red-100 p-2 rounded-lg text-red-500">{error}</p>
      ) : (
        isAuthenticated && (
          <p className="bg-green-100 p-2 rounded-lg text-green-500">
            Account activated! Redirecting in 5 seconds...
          </p>
        )
      )}
    </div>
  );
};

export default AccountActivation;
