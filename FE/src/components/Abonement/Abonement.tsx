import { useState, useCallback, useEffect } from "react";
import "./Abonement.scss";
import { useAppDispatch } from "../../app/hooks";
import HistoryElement from "../Elements/HistoryElement";
import StateToggler from "../Elements/StateToggler";
import { Abonement as AbonementType } from "../../types/Abonement";
import { checkTrainingReturn } from "../../features/trainings/trainingThunk";
import classNames from "classnames";

interface AbonementProps {
  abonement: AbonementType;
  userRole?: string;
}

export default function Abonement({ abonement, userRole }: AbonementProps) {
  const [freeze, setFreeze] = useState<boolean>(abonement.paused);
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    if (abonement.paused) {
      console.log("Abonement was frozen already, other actions forbidden!");
    } else {
      setFreeze((prev) => !prev);
      // dispatch(updateAbonement(abonement.id, { updateType: "freeze" }));
    }
  }, [abonement.paused]);

  useEffect(() => {
    const isNotExpired = new Date(abonement.expiratedAt) > new Date();
    const hasVisitedTrainings = abonement.visitedTrainings.length > 0;

    if (isNotExpired && hasVisitedTrainings) {
      dispatch(checkTrainingReturn(abonement.id));
    }
  }, [
    abonement.expiratedAt,
    abonement.visitedTrainings,
    abonement.id,
    dispatch,
  ]);

  return (
    <div className="abonement card-element">
      <div className="abonement__info">
        <div
          className={classNames("abonement__status status", {
            status: abonement.status === "active",
            "status--red": abonement.status === "ended",
          })}
        >
          {abonement.status}
        </div>
        <div className="abonement__container">
          <div>
            <b>Amount of trainings:</b> {abonement.amount}
          </div>
          <div>
            <div>
              <b>Left trainings:</b>{" "}
              <span className="abonement__left-trainings">
                {abonement.left}
              </span>
            </div>
            {userRole === "admin" && (
              <div className="abonement__freeze-container">
                Freeze
                <StateToggler state={freeze} handleClick={handleClick} />
              </div>
            )}
          </div>
        </div>
        <div className="abonement__container">
          <div>
            <b>From:</b>{" "}
            {abonement.activatedAt ? abonement.activatedAt.slice(0, 10) : null}
          </div>
          <div>
            <b>To:</b>{" "}
            {abonement.expiratedAt ? abonement.expiratedAt.slice(0, 10) : null}
          </div>
          <div>
            <b>Purchase date:</b> {abonement.createdAt.slice(0, 10)}
          </div>
        </div>
      </div>
      <div className="abonement__history">
        {/* <h2 className="abonement__title text-center">History</h2> */}
        <div className="abonement__container">
          {abonement.visitedTrainings.length > 0 ? (
            abonement.visitedTrainings.map((el) => (
              <HistoryElement key={el.id} data={el} trainer={false} />
            ))
          ) : (
            <p className="flex-1 text-gray-300">No trainings reserved!</p>
          )}
        </div>
      </div>
    </div>
  );
}
