import { useState, useMemo } from "react";

import reservationAccess from "../../utils/utils";
import { isTomorrow } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../features/notification/notificationSlice";
import { selectUser } from "../../features/user/userSlice";

export default function Training({ training }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const notification = useAppSelector(selectNotification);
  const user = useAppSelector(selectUser);

  const isReserved =
    user.data?.abonements.length > 0
      ? user.data?.abonements
          .find((a) => a.status === "active")
          .history.some((hTraining) => hTraining.id === training.id)
      : false;

  const currentTime = new Date();
  const trainingTime = new Date(training.date);
  const reservedPlaces = training.visitors.length;
  const hoursDiff = (trainingTime - currentTime) / (1000 * 60 * 60);
  const currentHour = currentTime.getHours();

  const access = reservationAccess(
    currentTime,
    trainingTime,
    reservedPlaces,
    hoursDiff
  );

  const handleNotification = (message) => {
    setError(true);
    dispatch(notifyWith(message));
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  const handleAction = async (updateType) => {
    const cancellationForbidden =
      updateType === "cancellation" &&
      (hoursDiff < 3 ||
        (isTomorrow(currentTime, trainingTime) &&
          [9, 10, 11].includes(trainingTime.getHours()) &&
          currentHour >= 21) ||
        ([9, 10, 11].includes(trainingTime.getHours()) && currentHour < 8));

    if (!activeAbonement) {
      handleNotification("No abonement, buy one to proceed!");
      return;
    }
    if (updateType === "reservation" && activeAbonement.left === 0) {
      handleNotification("No trainings left, buy a new abonement!");
      return;
    }
    if (cancellationForbidden) {
      handleNotification(
        "You cannot cancel morning trainings scheduled for tomorrow after 9p.m or any training 3 hours before its begining!"
      );
      return;
    }

    try {
      await dispatch(
        updateAbonement(activeAbonement.id, {
          updateType,
          trainingId: training.id,
        })
      );
      await dispatch(updateTraining(training.id, { updateType }));
    } catch (error) {
      console.log(error);
      handleNotification(
        error.response ? error.response.data.error : "error occurred"
      );
    }
  };

  return (
    <li className="training ">
      {notification && error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "0.5em",
          }}
        >
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
            className="p-1 text-white rounded-md px-4"
            style={{
              background: !access ? "gray" : isReserved ? "red" : "teal",
              cursor: access ? "pointer" : "not-allowed",
            }}
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
