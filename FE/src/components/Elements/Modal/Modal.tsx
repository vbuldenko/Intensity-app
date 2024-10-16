import { useState } from "react";
import "./Modal.scss";

interface ModalProps {
  btnName: string;
  data: React.ReactNode;
}

export default function Modal({ btnName, data }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="action-button"
        aria-expanded={isOpen}
      >
        {btnName}
      </button>

      {isOpen && (
        <div className="modal">
          <button
            className="modal__close-button self-end"
            onClick={toggleModal}
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="px-6">{data}</div>
        </div>
      )}
    </>
  );
}
