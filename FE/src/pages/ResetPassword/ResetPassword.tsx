import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import Notification from "../../components/Elements/Notification";
import { getErrorMessage } from "../../utils/utils";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { message } = await authService.resetPassword({
        password,
        passwordConfirm,
        resetToken,
      });
      setNotification(message);
      setTimeout(() => navigate("/sign-in", { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
    } catch (error) {
      setError(getErrorMessage(error) || "error occured");
    } finally {
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
        <h2 className="text-center">Reset Password</h2>
        {notification && <Notification message={notification} />}
        {error && <Notification message={error} type="error" />}
        <div className="auth__input-wrapper">
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            placeholder="Enter new password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="auth__input-wrapper">
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            name="passwordConfirm"
            placeholder="Confirm new password"
            onChange={({ target }) => setPasswordConfirm(target.value)}
          />
        </div>
        <button type="submit" className="auth__button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
