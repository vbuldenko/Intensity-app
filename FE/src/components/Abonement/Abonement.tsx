import { useState, useCallback, useEffect, memo } from "react";
import "./Abonement.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import HistoryElement from "../Elements/HistoryElement";
import StateToggler from "../Buttons/StateToggler";
import { Abonement as AbonementType } from "../../types/Abonement";
import { checkTrainingReturn } from "../../app/features/trainings/trainingThunk";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../app/features/user/userSlice";
import ConfirmModal from "../ConfirmModal";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { useAbonementManagement } from "../../hooks/useAbonementManagment";

interface AbonementProps {
  abonement: AbonementType;
  className?: string;
  // onUpdate?: (updatedAbonement: AbonementType) => void;
  // onDelete?: (id: string) => void;
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

interface AbonementInfoProps {
  abonement: AbonementType;
  isAdmin: boolean;
  onToggleFreeze: () => void;
}

interface AbonementHistoryProps {
  reservations: any[];
}

const StatusBadge = memo(({ status, className }: StatusBadgeProps) => (
  <div
    className={classNames(
      "abonement__status status status--left-border",
      {
        "status--green": status === "active",
        "status--red": status === "ended" || status === "expired",
        "status--gray": status === "inactive",
      },
      className
    )}
  >
    {status}
  </div>
));

const AbonementInfo = memo(
  ({ abonement, isAdmin, onToggleFreeze }: AbonementInfoProps) => {
    const { t } = useTranslation();
    const [freeze, setFreeze] = useState<boolean>(abonement.extended);

    const handleFreeze = useCallback(() => {
      if (!abonement.extended) {
        setFreeze((prev) => !prev);
        onToggleFreeze();
      }
    }, [abonement.extended, onToggleFreeze]);

    return (
      <div className="abonement__info">
        <div className="flex items-center justify-between absolute w-full top-0 left-0">
          <StatusBadge status={abonement.status} />
          <div className="status status--right-border">{abonement.type}</div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2 text-center pb-4">
            <div>
              id: <span className="text-pink-800">{abonement.id}</span>
            </div>

            <div className="bg-orange-400 text-white px-6 rounded-full font-bold">
              <span className="px-4">
                {t(`prices.${abonement.paymentMethod}`)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              {t("abonement.freeze")}
              <StateToggler
                state={freeze}
                disabled={freeze}
                handleClick={handleFreeze}
              />
            </div>
          </div>
        )}

        <div className="abonement__container">
          <div className="flex flex-col gap-2">
            <div>
              <b>{t("abonement.amount")}</b> {abonement.amount}
            </div>

            <div>
              <b>{t("abonement.from")}</b>{" "}
              {abonement.activatedAt
                ? new Date(abonement.activatedAt).toLocaleDateString()
                : null}
            </div>
          </div>

          <div className="abonement__left">
            <div className="flex items-center gap-4">
              <b>{t("abonement.left")}</b>{" "}
              <span className="abonement__left-trainings">
                {abonement.left}
              </span>
            </div>
            <div>
              <b>{t("abonement.to")}</b>{" "}
              {abonement.expiratedAt
                ? new Date(abonement.expiratedAt).toLocaleDateString()
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const AbonementHistory = memo(({ reservations }: AbonementHistoryProps) => {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="abonement__history">
      <button
        onClick={() => setShowHistory((prev) => !prev)}
        className="abonement__history-title bg-pink-700 flex items-center justify-between"
        aria-expanded={showHistory}
      >
        <span>{t("abonement.history")}</span>
        <BarsArrowDownIcon
          className={classNames("h-5 w-5 transition-transform", {
            "transform rotate-180": showHistory,
          })}
        />
      </button>
      {showHistory && (
        <div className="abonement__container">
          {reservations.length > 0 ? (
            reservations.map((el) => (
              <HistoryElement key={el.id} data={el.training} trainer={false} />
            ))
          ) : (
            <p className="flex-1 text-gray-300 text-center">
              {t("abonement.noHistory")}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

const Abonement: React.FC<AbonementProps> = ({ abonement, className = "" }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(selectUser);
  const isAdmin = user?.role === "admin";

  const { notification, handleToggleFreeze, handleDelete } =
    useAbonementManagement({
      abonement,
    });

  useEffect(() => {
    const isNotExpired = new Date(abonement.expiratedAt) > new Date();
    const hasReservations = abonement.reservations.length > 0;

    if (isNotExpired && hasReservations) {
      dispatch(checkTrainingReturn(abonement.id));
    }
  }, [
    abonement.reservations.length,
    abonement.expiratedAt,
    abonement.id,
    dispatch,
  ]);

  return (
    <div className={`abonement ${className}`}>
      <AbonementInfo
        abonement={abonement}
        isAdmin={isAdmin}
        onToggleFreeze={handleToggleFreeze}
      />

      <AbonementHistory reservations={abonement.reservations} />

      {isAdmin && abonement.status === "inactive" && (
        <div className="p-4">
          <ConfirmModal
            triggerName={t("abonement.remove")}
            triggerClassName="bg-pink-800 text-white"
            onConfirm={handleDelete}
            notification={notification}
            // confirmButtonText={t("common.delete")}
            // cancelButtonText={t("common.cancel")}
            // title={t("abonement.confirmDelete")}
          />
        </div>
      )}
    </div>
  );
};

export default memo(Abonement);
