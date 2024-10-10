import { useState } from "react";
import "./Modal.scss";

export default function Modal({ btnName, data }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button onClick={toggleModal} className="action-button">
        {btnName}
      </button>

      {isOpen && (
        <div className="modal">
          <button
            className="modal__close-button self-end"
            onClick={toggleModal}
          >
            &times;
          </button>
          <div className="px-6">{data}</div>
        </div>
      )}
    </>
  );
}
