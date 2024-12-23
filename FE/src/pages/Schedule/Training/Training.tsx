import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { reserveTraining } from "../../../app/features/trainings/trainingThunk";
import { reservationAccess, getErrorMessage } from "../../../utils/utils";
import {
  getCurrentAbonement,
  isCancellationForbidden,
} from "../../../utils/abonement";
import { calculateHoursDiff } from "../../../utils/trainings";
import "./Training.scss";

import { selectUser } from "../../../app/features/user/userSlice";
import classNames from "classnames";
import { Training as TrainingType } from "../../../types/Training";

import ReservationButton from "../../../components/Elements/ReservationButton";
import Notification from "../../../components/Elements/Notification";
import { useTranslation } from "react-i18next";
import { selectAbonements } from "../../../app/features/abonements/abonementSlice";

type NotificationType = "error" | "notification" | undefined;

type NotificationState = {
  message: string;
  type: NotificationType;
} | null;

export default function Training({ training }: { training: TrainingType }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState>(null);
  const { data: user, loading } = useAppSelector(selectUser);
  const abonements = useAppSelector(selectAbonements);
  const abonement = abonements ? getCurrentAbonement(abonements) : null;

  const trainingTime = useMemo(() => new Date(training.date), [training.date]);
  const reservedPlaces = training.reservations.length;
  const reservation = training.reservations.find((r) => r.user === user?.id);

  const hoursDiff = calculateHoursDiff(trainingTime);
  const access = reservationAccess(
    new Date(),
    trainingTime,
    reservedPlaces,
    hoursDiff
  );

  const handleNotification = (
    message: string,
    type?: "error" | "notification"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = async (updateType: "reservation" | "cancellation") => {
    console.log(
      "| training hours | current hours |",
      trainingTime.getHours(),
      new Date().getHours()
    );

    const updatedAccess = reservationAccess(
      new Date(),
      trainingTime,
      reservedPlaces,
      calculateHoursDiff(trainingTime)
    );
    if (!updatedAccess) {
      return handleNotification(
        t("training.reservation_period_passed"),
        "error"
      );
    }

    if (!abonement) {
      return handleNotification(t("training.no_abonement"), "error");
    }

    if (updateType === "reservation" && abonement.left === 0) {
      return handleNotification(t("training.no_trainings_left"), "error");
    }

    const isForbidden = isCancellationForbidden(
      updateType,
      hoursDiff,
      trainingTime
    );
    if (isForbidden) {
      return handleNotification(t("training.cancel_forbidden_rule"), "error");
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        reserveTraining({
          trainingId: training.id,
          abonementId: reservation ? reservation.abonement : abonement.id,
          updateType,
        })
      ).unwrap();
    } catch (error) {
      handleNotification(
        getErrorMessage(error) === "Abonement has expired!"
          ? t("training.abonement_expired")
          : getErrorMessage(error),
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
