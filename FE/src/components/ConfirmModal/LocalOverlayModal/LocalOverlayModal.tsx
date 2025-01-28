import { useState } from "react";
import "./LocalOverlayModal.scss";
import classNames from "classnames";

interface ModalProps {
  trigger: { name: string; className?: string };
  className?: string;
  children: (closeModal: () => void) => React.ReactNode;
  showCloseButton?: boolean;
}

export default function LocalOverlayModal({
  trigger,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className={classNames("modal__trigger", trigger.className)}
        aria-expanded={isOpen}
      >
        {trigger.name}
      </button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && toggleModal()}
        >
          <div className={classNames("modal", className)}>
            {showCloseButton && (
              <button
                className="modal__close-btn"
                onClick={toggleModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
            <div className="modal__body">{children(toggleModal)}</div>
          </div>
        </div>
      )}
    </>
  );
}
