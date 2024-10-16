import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/utils";
import { authService } from "../../services/authService";
import Notification from "../../components/Elements/Notification";

const ForgotPassword = () => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // const path = '/reset-password';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { message } = await authService.requestRestore(email);
      setEmail("");
      setNotification(message);
      // setTimeout(() => navigate(path, { replace: true }), 5000); //path - to redirect to the page where user came from or default. replace - to delete sign in path from history stack
    } catch (error) {
      setError(getErrorMessage(error) || "error occured");
    } finally {
      setTimeout(() => {
        setError(null);
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div className="auth__form-wrapper card-element">
      <form className="auth__form" onSubmit={handleSubmit}>
        <h2 className="text-center">Forgot Password</h2>
        {notification && <Notification message={notification} />}
        {error && <Notification message={error} type="error" />}
        <div className="auth__input-wrapper">
          <input
            id="email"
            type="email"
            value={email}
            name="email"
            placeholder="Enter your account email"
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <button type="submit" className="auth__button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
