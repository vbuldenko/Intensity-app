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

export default function Training({ training }: { training: TrainingType }) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "notification" | undefined;
  } | null>(null);
  const { data: user } = useAppSelector(selectUser);
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

  const hoursDiff = useMemo(
    () => calculateHoursDiff(trainingTime),
    [trainingTime]
  );

  const access = useMemo(
    () =>
      reservationAccess(new Date(), trainingTime, reservedPlaces, hoursDiff),
    [trainingTime, reservedPlaces, hoursDiff]
  );
  // const access = true;

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
      return handleNotification("The reservation period has passed!", "error");
    }

    if (!abonement) {
      return handleNotification("No abonement, buy one to proceed!", "error");
    }

    if (updateType === "reservation" && abonement.left === 0) {
      return handleNotification(
        "No trainings left, buy a new abonement!",
        "error"
      );
    }

    const isForbidden = isCancellationForbidden(
      updateType,
      hoursDiff,
      trainingTime,
      new Date().getHours()
    );
    if (isForbidden) {
      return handleNotification(
        "You cannot cancel morning trainings after 9p.m or 3 hours before it starts!",
        "error"
      );
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
    <li className="schedule__training">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
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
            Trainer: <b>{training.instructor?.firstName}</b>
          </p>
        )}
        {
          <div className="schedule__training-data">
            <p>{training.time}</p>
            {(access || user) && (
              <p className="m-text w-max">
                Places left: {training.capacity - reservedPlaces}
              </p>
            )}
          </div>
        }

        {user && (
          <ReservationButton
            access={access}
            isReserved={isReserved}
            isSubmitting={isSubmitting}
            onClick={() =>
              handleAction(isReserved ? "cancellation" : "reservation")
            }
          />
        )}
      </div>
    </li>
  );
}
