import { useState } from "react";

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
          <button className="close-button align-right" onClick={toggleModal}>
            &times;
          </button>
          {data}
        </div>
      )}
    </>
  );
}
