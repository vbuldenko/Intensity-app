import { useState } from 'react';

// Modal Component
function Modal({ isOpen, closeModal, content }) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <button className="close-button align-right" onClick={closeModal}>
                &times;
            </button>
            <div className="modal-content align-center">
                {/* <p>This is the content of the modal</p> */}
                {content}
            </div>
        </div>
    );
}

// Parent Component
function ModalComponent({ btnName, data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="purchase-button add-abonement-btn"
            >
                {btnName}
            </button>
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                content={data}
            />
        </>
    );
}

export default ModalComponent;
