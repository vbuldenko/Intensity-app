import React, { useState } from "react";
import { getErrorMessage } from "../../utils/utils";
import { authService } from "../../services/authService";
import Notification from "../../components/Elements/Notification";
import { useTranslation } from "react-i18next";

const NOTIFICATION_TIMEOUT = 5000;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "notification";
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await authService.requestRestore(email);
      setEmail("");
      setNotification({
        message: t("forgotPassword.successMessage"),
        type: "notification",
      });
    } catch (error) {
      setNotification({
        message: getErrorMessage(error) || t("forgotPassword.errorMessage"),
        type: "error",
      });
      setTimeout(() => {
        setNotification(null);
      }, NOTIFICATION_TIMEOUT);
    }
  };

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form border-b-0" onSubmit={handleSubmit}>
        <h2 className="text-center">{t("forgotPassword.title")}</h2>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
        {!notification && (
          <>
            <div className="auth__input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                name="email"
                placeholder={t("forgotPassword.emailPlaceholder")}
                onChange={({ target }) => setEmail(target.value)}
              />
            </div>
            <button type="submit" className="auth__button">
              {t("forgotPassword.submitButton")}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
