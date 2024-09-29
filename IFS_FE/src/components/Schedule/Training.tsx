import { useState, useMemo } from "react";
import { reservationAccess, getErrorMessage } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  notifyWith,
  selectNotification,
} from "../../features/notification/notificationSlice";
import { selectUser } from "../../features/user/userSlice";
import { getAbonement, isCancellationForbidden } from "../../utils/abonement";
import { reserveTraining } from "../../features/trainings/trainingThunk";

export default function Training({ training }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const notification = useAppSelector(selectNotification);
  const user = useAppSelector(selectUser);
  const abonement = getAbonement(user.data);

  const isReserved =
    abonement?.history.some((hTraining) => hTraining.id === training.id) ||
    false;

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
  console.log("Access: ", access);

  const handleNotification = (message) => {
    setError(true);
    dispatch(notifyWith(message));
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  const handleAction = async (updateType) => {
    const isForbidden = isCancellationForbidden(
      updateType,
      hoursDiff,
      trainingTime,
      currentHour
    );

    if (!abonement) {
      handleNotification("No abonement, buy one to proceed!");
      return;
    }
    if (updateType === "reservation" && abonement.left === 0) {
      handleNotification("No trainings left, buy a new abonement!");
      return;
    }
    if (isForbidden) {
      handleNotification(
        "You cannot cancel morning trainings scheduled for tomorrow after 9p.m or any training 3 hours before its begining!"
      );
      return;
    }

    try {
      await dispatch(reserveTraining(training.id, abonement.id, updateType));
    } catch (error) {
      console.log(error);
      handleNotification(getErrorMessage(error));
    }
  };

  return (
    <li className="schedule__training w-full">
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
