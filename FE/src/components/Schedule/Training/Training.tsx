import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../../features/notification/notificationSlice";
import { reserveTraining } from "../../../features/trainings/trainingThunk";
import { reservationAccess, getErrorMessage } from "../../../utils/utils";
import {
  getCurrentAbonement,
  isCancellationForbidden,
} from "../../../utils/abonement";
import { calculateHoursDiff } from "../../../utils/trainings";
import "./Training.scss";
import ReservationButton from "../../Elements/ReservationButton";
import { selectAbonements } from "../../../features/abonements/abonementSlice";
import { selectUser } from "../../../features/user/userSlice";
import classNames from "classnames";

export default function Training({ training }) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const notification = useAppSelector(selectNotification);
  const { data: user } = useAppSelector(selectUser);
  const allAbonements = useAppSelector(selectAbonements);
  const abonement = useMemo(
    () => getCurrentAbonement(allAbonements),
    [allAbonements]
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

  const handleNotification = (message) => {
    setError(true);
    dispatch(notifyWith(message));
    setTimeout(() => setError(false), 3000);
  };

  const handleAction = async (updateType) => {
    const updatedAccess = reservationAccess(
      new Date(),
      trainingTime,
      reservedPlaces,
      calculateHoursDiff(trainingTime)
    );
    if (!updatedAccess) {
      return handleNotification("The reservation period has passed!");
    }

    if (!abonement) {
      return handleNotification("No abonement, buy one to proceed!");
    }

    if (updateType === "reservation" && abonement.left === 0) {
      return handleNotification("No trainings left, buy a new abonement!");
    }

    const isForbidden = isCancellationForbidden(
      updateType,
      hoursDiff,
      trainingTime,
      new Date().getHours()
    );
    if (isForbidden) {
      return handleNotification(
        "You cannot cancel morning trainings after 9p.m or 3 hours before it starts!"
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
      );
    } catch (error) {
      handleNotification(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <li className="schedule__training">
      {notification && error && (
        <div className="notification-error">{notification}</div>
      )}
      <div
        className={classNames("training__content card-element", {
          "flex items-center justify-center flex-wrap gap-4": !user,
          "flex flex-col gap-4": user,
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
        <div className="schedule__training-data">
          <p>{training.time}</p>
          <p className="m-text w-max">
            Places left: {training.capacity - reservedPlaces}
          </p>
        </div>

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
