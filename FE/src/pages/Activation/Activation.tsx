import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../app/features/user/userSlice";
import { activate } from "../../app/features/user/userThunk";
import Loader from "../../components/Elements/Loader";
import { Path } from "../../types/Path";
import { useTranslation } from "react-i18next";

const AccountActivation = () => {
  const { t } = useTranslation();
  const { activationToken } = useParams();
  const { loading, error, isAuthenticated } = useAppSelector(selectUser);
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
      <h2 className="text-center text-xl mb-4">{t("activation.title")}</h2>
      {loading ? (
        <>
          <Loader />
          <p className="p-2 rounded-lg mt-4 text-green-500">
            {t("activation.progress")}
          </p>
        </>
      ) : error ? (
        <p className="bg-red-100 py-2 px-6 rounded-lg text-red-500 m-4 text-center">
          {error}
        </p>
      ) : (
        isAuthenticated && (
          <p className="bg-green-100 py-2 px-6 rounded-lg text-green-500 m-4 text-center">
            {t("activation.success")}
          </p>
        )
      )}
    </div>
  );
};

export default AccountActivation;
