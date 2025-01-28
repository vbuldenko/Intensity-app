import React, { useState } from "react";
import LocalOverlayModal from "../ConfirmModal/LocalOverlayModal";
import Notification from "../Elements/Notification";
import { Notification as NotificationType } from "../../types/Notification";
import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
  triggerName: string;
  triggerClassName?: string;
  confirmMessage?: string;
  onConfirm: () => Promise<boolean>;
  notification: NotificationType | null;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  triggerName,
  triggerClassName,
  confirmMessage,
  onConfirm,
  notification,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  return (
    <LocalOverlayModal
      trigger={{
        name: triggerName,
        className: triggerClassName,
      }}
      showCloseButton={false}
    >
      {(closeModal) => (
        <div className="flex flex-col gap-4">
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
          <p className="text-center">
            {confirmMessage ? confirmMessage : t("gen.ensure")}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={async () => {
                setIsSubmitting(true);
                const success = await onConfirm();
                setIsSubmitting(false);
                if (success) {
                  // Show notification and then close the modal after a short delay
                  setTimeout(() => {
                    closeModal();
                  }, 3000);
                }
              }}
              className="bg-red-700 text-white px-4 py-1 rounded-md min-w-32 min-h-10 flex items-center justify-center"
            >
              {isSubmitting && <div className="reservation-btn__spinner"></div>}
              {!isSubmitting && "Confirm"}
            </button>
            <button
              onClick={closeModal}
              className="bg-green-700 text-white px-4 py-1 rounded-md min-w-32 min-h-10 flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </LocalOverlayModal>
  );
};

export default ConfirmModal;
