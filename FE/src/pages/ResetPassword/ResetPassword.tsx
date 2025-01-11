import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import Notification from "../../components/Elements/Notification";
import { getErrorMessage } from "../../utils/utils";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await authService.resetPassword({
        password,
        passwordConfirm,
        resetToken,
      });

      setNotification(t("resetPassword.success"));
      setTimeout(() => navigate("/sign-in", { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
    } catch (error) {
      setError(getErrorMessage(error) || t("resetPassword.error"));
    } finally {
      setIsSubmitting(false);
      setPassword("");
      setPasswordConfirm("");
      setTimeout(() => {
        setError(null);
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form border-b-0" onSubmit={handleSubmit}>
        <h2 className="text-center">{t("resetPassword.title")}</h2>
        {notification && <Notification message={notification} />}
        {error && <Notification message={error} type="error" />}
        <div className="auth__input-wrapper">
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            placeholder={t("resetPassword.password")}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            name="passwordConfirm"
            placeholder={t("resetPassword.passwordConfirm")}
            onChange={({ target }) => setPasswordConfirm(target.value)}
          />
        </div>
        <button type="submit" className="auth__button" disabled={isSubmitting}>
          {isSubmitting && <div className="reservation-btn__spinner"></div>}
          {!isSubmitting && t("resetPassword.submitButton")}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
