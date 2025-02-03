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
        className="popup__button bg-pink-800 text-white"
        aria-expanded={isOpen}
      >
        {btnName}
      </button>

      {isOpen && (
        <div className="popup-container">
          <div className="popup">
            <button
              className="popup__close-button self-end"
              onClick={toggleModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="">{data}</div>
          </div>
        </div>
      )}
    </>
  );
}
