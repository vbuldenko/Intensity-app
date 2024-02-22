import { useState } from 'react';

function ModalComponent({ btnName, data }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            <button onClick={toggleModal} className="purchase-button">
                {btnName}
            </button>

            {isOpen && (
                <div className="modal">
                    <button
                        className="close-button align-right"
                        onClick={toggleModal}
                    >
                        &times;
                    </button>
                    {data}
                </div>
            )}
        </>
    );
}

export default ModalComponent;
