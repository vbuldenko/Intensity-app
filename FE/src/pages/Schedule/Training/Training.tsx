import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { reserveTraining } from "../../../app/features/trainings/trainingThunk";
import { getErrorMessage } from "../../../utils/utils";
import { getCurrentAbonement } from "../../../utils/abonement";
import { reservationAccess } from "../../../utils/trainings";
import "./Training.scss";
import { selectUser } from "../../../app/features/user/userSlice";
import { Training as TrainingType } from "../../../types/Training";
import ReservationButton from "../../../components/Elements/ReservationButton";
import Notification from "../../../components/Elements/Notification";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";
import { useNotification } from "../../../hooks/useNotification";

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
  const reservation = training.reservations.find((r) => r.user === user?.id);

  const access = reservationAccess(trainingTime, reservedPlaces);

  const handleAction = async (updateType: "reservation" | "cancellation") => {
    console.log(
      "current hours | training hours",
      new Date(),
      trainingTime.getHours()
    );

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

  return (
    <li className="schedule__training relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          className="absolute top-0 w-full"
        />
      )}
      <div
        className={classNames("training__content card-element", {
          "flex items-center justify-center flex-wrap gap-4": !user,
          "flex flex-col gap-1": user,
        })}
      >
        <div className="schedule__training-data--accent">
          <p>{training.type.toUpperCase()}</p>
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
            {(access || user) && (
              <p className="m-text w-max">
                {t("training.left")} {training.capacity - reservedPlaces}
              </p>
            )}
          </div>
        }

        {user && (
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
      </div>
    </li>
  );
}
