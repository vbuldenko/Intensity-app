import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  cancelTrainingByAdmin,
  reserveTraining,
} from "../../../app/features/trainings/trainingThunk";
import { getErrorMessage } from "../../../utils/utils";
import { getCurrentAbonement } from "../../../utils/abonement";
import { reservationAccess } from "../../../utils/trainings";
import "./Training.scss";
import { selectUser } from "../../../app/features/user/userSlice";
import { Training as TrainingType } from "../../../types/Training";
import ReservationButton from "../../../components/Buttons/ReservationButton";
import Notification from "../../../components/Elements/Notification";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmModal from "../../../components/ConfirmModal";
import { ROLE } from "../../../utils/constants";
import LocalOverlayModal from "../../../components/ConfirmModal/LocalOverlayModal";

export default function Training({ training }: { training: TrainingType }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, handleNotification } = useNotification();
  const { data: user, loading } = useAppSelector(selectUser);
  const abonements = useAppSelector(selectAbonements);
  const abonement = abonements ? getCurrentAbonement(abonements) : null;

  const trainingTime = useMemo(() => new Date(training.date), []);

  const reservedPlaces = training.reservations.length;
  const reservation = training.reservations.find((r) => r.user.id === user?.id);

  const access = reservationAccess(trainingTime, reservedPlaces);

  const handleAction = async (updateType: "reservation" | "cancellation") => {
    try {
      setIsSubmitting(true);
      await dispatch(
        reserveTraining({
          trainingId: training.id,
          abonementId: reservation ? reservation.abonement : abonement?.id,
          updateType,
        })
      ).unwrap();
    } catch (error) {
      handleNotification(
        (() => {
          switch (getErrorMessage(error)) {
            case "Abonement not found!":
              return t("training.no_abonement");
            case "Abonement has expired!":
              return t("training.abonement_expired");
            case "Abonement has ended!":
              return t("training.no_trainings_left");
            case "Cancel forbidden!":
              return t("training.cancel_forbidden_rule");
            case "Reservation period has passed!":
              return t("training.reservation_period_passed");
            case "Abonement Id is required!":
              return t("training.no_abonement2");
            case "No places left!":
              return t("training.no_places");
            default:
              return getErrorMessage(error);
          }
        })(),
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrainingAbort = async () => {
    try {
      await dispatch(cancelTrainingByAdmin(training.id)).unwrap();
      handleNotification("Success");
      return true;
    } catch (error) {
      handleNotification(getErrorMessage(error), "error");
      return false;
    }
  };

  return (
    <li className="schedule__training card-element relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          className="absolute top-0 w-full"
        />
      )}
      <div
        className={classNames("training__content", {
          "training__content--closed": !user,
          "training__content--open": user,
        })}
      >
        {training.isCancelled && (
          <div className="status status--red status--left-border absolute top-0 left-0">
            {t("training.statusCancelled")}
          </div>
        )}
        <div className="schedule__training-data--accent flex gap-2 justify-center items-center flex-wrap">
          <p>{training.type.toUpperCase()}</p>
          {user?.role === ROLE.admin && (
            <p className="text-red-500">ID:{training.id}</p>
          )}
        </div>
        {user && (
          <p className="schedule__training-data">
            {t("training.trainer")}
            {":"}
            <b>{training.instructor?.firstName}</b>
          </p>
        )}
        {
          <div className="schedule__training-data">
            <p>{training.time}</p>
            {user?.role !== ROLE.admin && (
              <p className="m-text w-max">
                {t("training.left")} {training.capacity - reservedPlaces}
              </p>
            )}
            {user?.role === ROLE.admin && (
              <LocalOverlayModal
                trigger={{
                  name: `${t("training.left")} ${training.capacity - reservedPlaces}`,
                  className: "w-max py-1 px-4",
                }}
              >
                {() => (
                  <ul className="visitors scrollbar-hide ">
                    {training.reservations.map(({ id, user }, index) => (
                      <li className="visitors__item" key={id}>
                        <div className="visitors__indicator">
                          <div className="visitors__dot"></div>
                          {index < training.reservations.length - 1 && (
                            <div className="visitors__line"></div>
                          )}
                        </div>
                        <Link
                          to={`../users/${user.id}`}
                          className="visitors__name"
                        >
                          {user.firstName} {user.lastName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </LocalOverlayModal>
            )}
          </div>
        }

        {user?.role === "client" && (
          <ReservationButton
            access={access}
            isReserved={reservation ? true : false}
            isSubmitting={isSubmitting}
            isDataUpdating={loading}
            onClick={() =>
              handleAction(reservation ? "cancellation" : "reservation")
            }
          />
        )}
        {user?.role === "admin" && training.reservations.length > 0 && (
          <ConfirmModal
            triggerName={t("training.cancelTraining")}
            triggerClassName="bg-pink-800 text-white mt-2"
            onConfirm={handleTrainingAbort}
            notification={notification}
          />
        )}
      </div>
    </li>
  );
}
