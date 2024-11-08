import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { reserveTraining } from "../../../features/trainings/trainingThunk";
import { reservationAccess, getErrorMessage } from "../../../utils/utils";
import {
  getCurrentAbonement,
  isCancellationForbidden,
} from "../../../utils/abonement";
import { calculateHoursDiff } from "../../../utils/trainings";
import "./Training.scss";

import { selectUser } from "../../../features/user/userSlice";
import classNames from "classnames";
import { Training as TrainingType } from "../../../types/Training";

import ReservationButton from "../../../components/Elements/ReservationButton";
import Notification from "../../../components/Elements/Notification";
import { useTranslation } from "react-i18next";

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
  const abonement = useMemo(
    () => getCurrentAbonement(user?.abonements),
    [user?.abonements]
  );

  const trainingTime = useMemo(() => new Date(training.date), [training.date]);
  const reservedPlaces = training.visitors.length;

  const isReserved = useMemo(
    () =>
      abonement?.visitedTrainings.some((t) => t.id === training.id) || false,
    [abonement]
  );

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
      trainingTime,
      new Date().getHours()
    );
    if (isForbidden) {
      return handleNotification(t("training.cancel_forbidden_rule"), "error");
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        reserveTraining({
          trainingId: training.id,
          abonementId: abonement.id,
          updateType,
        })
      ).unwrap();
      handleNotification("Success");
    } catch (error) {
      handleNotification(getErrorMessage(error), "error");
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
            isReserved={isReserved}
            isSubmitting={isSubmitting}
            isDataUpdating={loading}
            onClick={() =>
              handleAction(isReserved ? "cancellation" : "reservation")
            }
          />
        )}
      </div>
    </li>
  );
}
