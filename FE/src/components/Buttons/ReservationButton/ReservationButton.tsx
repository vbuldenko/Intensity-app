import React from "react";
import classNames from "classnames";
import "./ReservationButton.scss";
import { useTranslation } from "react-i18next";

interface ButtonProps {
  access: boolean;
  isReserved: boolean;
  isSubmitting: boolean;
  isDataUpdating: boolean;
  onClick: () => Promise<void>; // Update to return a Promise
}

const ReservationButton: React.FC<ButtonProps> = ({
  access,
  isReserved,
  isSubmitting,
  isDataUpdating,
  onClick,
}) => {
  const { t } = useTranslation();

  const buttonClass = classNames("reservation-btn mt-2", {
    "reservation-btn--disabled": !access,
    "reservation-btn--reserve": access && !isReserved && !isSubmitting,
    "reservation-btn--cancel": access && isReserved && !isSubmitting,
    "reservation-btn--loading": isSubmitting,
  });

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={!access || isSubmitting || isDataUpdating} // Disable button if no access or during submission
    >
      {isSubmitting && <div className="reservation-btn__spinner"></div>}
      {!access
        ? t("reserveBtn.closed")
        : isReserved
          ? t("reserveBtn.cancel")
          : t("reserveBtn.reserve")}
    </button>
  );
};

export default ReservationButton;
