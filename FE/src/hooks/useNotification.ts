import { useState } from "react";

interface Notification {
  message: string;
  type?: "error" | "notification";
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const handleNotification = (
    message: string,
    type?: "error" | "notification"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return {
    notification,
    handleNotification,
  };
};
