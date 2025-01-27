import React from "react";
import Modal from "./Modal";
import Notification from "../Elements/Notification";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  notification?: { message: string; type: any };
}

const ConfirmModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  notification,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            className="w-60 mt-2"
          />
        )}
        <p className="py-2">{t("gen.ensure")}</p>
        <div className="flex space-x-4">
          <button
            className="bg-gray-500 rounded-xl py-1 px-6 min-w-60 min-h-10 flex items-center justify-center"
            onClick={onClose}
          >
            {t("gen.cancel")}
          </button>
          <button
            className="bg-teal-500 rounded-xl py-1 px-6 min-w-60 min-h-10 flex items-center justify-center"
            onClick={onConfirm}
          >
            {isSubmitting && <div className="reservation-btn__spinner"></div>}
            {!isSubmitting && t("gen.confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
