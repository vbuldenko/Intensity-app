import React, { useState } from "react";
import { getErrorMessage } from "../../utils/utils";
import { authService } from "../../services/authService";
import Notification from "../../components/Elements/Notification";

const NOTIFICATION_TIMEOUT = 5000;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "notification";
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { message } = await authService.requestRestore(email);
      setEmail("");
      setNotification({ message, type: "notification" });
    } catch (error) {
      setNotification({
        message: getErrorMessage(error) || "An error occurred",
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
        <h2 className="text-center">Forgot Password</h2>
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
                placeholder="Enter your account email"
                onChange={({ target }) => setEmail(target.value)}
              />
            </div>
            <button type="submit" className="auth__button">
              Send
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
