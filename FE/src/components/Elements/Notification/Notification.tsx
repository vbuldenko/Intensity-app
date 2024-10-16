import React from "react";
import classNames from "classnames";

interface NotificationProps {
  message: string;
  type?: "error" | "notification";
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "notification",
}) => {
  return (
    <p
      className={classNames("p-4 rounded-lg text-center", {
        "bg-red-100 text-red-700": type === "error",
        "bg-green-100 text-green-700": type === "notification",
      })}
    >
      {message}
    </p>
  );
};

export default Notification;
