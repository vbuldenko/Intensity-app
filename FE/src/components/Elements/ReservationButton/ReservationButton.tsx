import classNames from "classnames";
import "./ReservationButton.scss";

interface ButtonProps {
  access: boolean;
  isReserved: boolean;
  isSubmitting: boolean;
  onClick: () => void;
}

export default function ReservationButton({
  access,
  isReserved,
  isSubmitting,
  onClick,
}: ButtonProps) {
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
      disabled={!access || isSubmitting} // Disable button if no access or during submission
    >
      {isSubmitting && <div className="reservation-btn__spinner"></div>}

      {isSubmitting
        ? ""
        : !access
          ? "Closed"
          : isReserved
            ? "Cancel"
            : "Reserve"}
    </button>
  );
}
