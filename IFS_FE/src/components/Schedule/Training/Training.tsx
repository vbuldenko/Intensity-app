import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../../features/notification/notificationSlice";
import { selectUser } from "../../../features/user/userSlice";
import { reserveTraining } from "../../../features/trainings/trainingThunk";
import { reservationAccess, getErrorMessage } from "../../../utils/utils";
import {
  getAbonement,
  isCancellationForbidden,
} from "../../../utils/abonement";
import { calculateHoursDiff } from "../../../utils/trainings";
import "./Training.scss";

export default function Training({ training }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const notification = useAppSelector(selectNotification);
  const user = useAppSelector(selectUser);
  const abonement = useMemo(() => getAbonement(user.data), [user]);

  const trainingTime = useMemo(() => new Date(training.date), [training.date]);
  const reservedPlaces = training.visitors.length;

  const isReserved = useMemo(
    () =>
      abonement?.visitedTrainings.some(
        (hTraining) => hTraining.id === training.id
      ) || false,
    [abonement, training.id]
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
      await dispatch(
        reserveTraining({
          trainingId: training.id,
          abonementId: abonement.id,
          updateType,
        })
      );
    } catch (error) {
      handleNotification(getErrorMessage(error));
    }
  };

  return (
    <li className="schedule__training w-full">
      {notification && error && (
        <div className="notification-error text-center p-2 text-red-500">
          {notification}
        </div>
      )}
      <div className="training__content card-element p-4">
        <div className="flex gap-2">
          <p>{training.time}</p>
          <p className="font-bold">{training.type.toUpperCase()}</p>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="status">
            Trainer: <b>{training.instructor?.firstName}</b>
          </p>
          <p className="m-text">
            Places left: {training.capacity - reservedPlaces}
          </p>
          <button
            className={`p-1 text-white rounded-md px-4 ${!access ? "button-disabled" : isReserved ? "button-cancel" : "button-reserve"}`}
            disabled={!access}
            onClick={() =>
              handleAction(isReserved ? "cancellation" : "reservation")
            }
          >
            {!access ? "Closed" : isReserved ? "Cancel" : "Reserve"}
          </button>
        </div>
      </div>
    </li>
  );
}