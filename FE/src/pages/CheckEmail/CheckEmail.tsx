// import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

const CheckEmail = () => {
  const { t } = useTranslation();
  return (
    <div className="check-email card-element flex flex-col py-6 px-2 gap-5 items-center text-center">
      <h2 className="text-2xl text-green-400">{t("signup.checkEmailTitle")}</h2>
      <p className="text-teal-100">{t("signup.checkEmailText")}</p>
      {/* <p className="flex gap-4 items-center">
        Didn't receive the email?{" "}
        <Link
          className="text-teal-500 font-bold card-element text-center p-1"
          to="/resend-activation"
        >
          Resend Activation Email
        </Link>
      </p> */}
    </div>
  );
};

export default CheckEmail;
