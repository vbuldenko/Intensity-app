import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { AuthCredentials } from "../../types/Auth";
import { Path } from "../../types/Path";
import { getErrorMessage } from "../../utils/utils";
import Notification from "../../components/Elements/Notification";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const defaultUserData: AuthCredentials = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
  };
  const [notification, setNotification] = useState<string | null>(null);

  const [signUpData, setSignUpData] = useState(defaultUserData);
  const navigate = useNavigate();

  const handleNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await authService.register(signUpData);
      setSignUpData(defaultUserData);
      navigate(`/${Path.CheckEmail}`, { replace: true });
    } catch (error: any) {
      handleNotification(getErrorMessage(error));
    }
  };

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h1 className="auth__title">{t("signup.title")}</h1>
        {notification && <Notification message={notification} type="error" />}
        <div className="auth__input-wrapper">
          <input
            id="firstName"
            type="text"
            value={signUpData.firstName}
            name="firstName"
            placeholder={t("signup.firstNamePlaceholder")}
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="lastName"
            type="text"
            value={signUpData.lastName}
            name="lastName"
            placeholder={t("signup.lastNamePlaceholder")}
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="email"
            type="text"
            value={signUpData.email}
            name="email"
            placeholder={t("signup.emailPlaceholder")}
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="phone"
            type="text"
            value={signUpData.phone}
            name="phone"
            placeholder={t("signup.phonePlaceholder")}
            onChange={handleChange}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="password"
            type="password"
            value={signUpData.password}
            name="password"
            placeholder={t("signup.passwordPlaceholder")}
            onChange={handleChange}
          />
        </div>
        {/* <div className="auth__radio-role flex flex-col gap-2">
          <label className="self-center font-bold text-teal-500">
            {t("signup.roleQuestion")}
          </label>
          <div className="card-element flex gap-6 justify-center p-1">
            <label className="label flex gap-1">
              <input
                type="radio"
                name="role"
                value="client"
                checked={signUpData.role === "client"}
                onChange={handleChange}
              />
              <span>{t("signup.roleClient")}</span>
            </label>
            <label className="label flex gap-1">
              <input
                type="radio"
                name="role"
                value="trainer"
                checked={signUpData.role === "trainer"}
                onChange={handleChange}
              />
              <span>{t("signup.roleTrainer")}</span>
            </label>
          </div>
        </div> */}
        <button id="login-button" type="submit" className="auth__button">
          {t("signup.submitButton")}
        </button>
      </form>
      <div className="auth__subsection">
        <div className="flex gap-4 px-8 py-4 justify-between items-center">
          <p className="text-sm">{t("signup.loginQuestion")}</p>
          <Link className="font-bold text-xl text-teal-500" to="/sign-in">
            {t("signup.login")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
