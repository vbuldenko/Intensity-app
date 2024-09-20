import { useState } from "react";
// import { updateAbonement } from "../../../reducers/abonementReducer";
import "./Abonement.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import HistoryElement from "../Elements/HistoryElement";
import StateToggler from "../Elements/StateToggler";
import { Abonement as AbonementType } from "../../types/Abonement";

interface AbonementProps {
  abonement: AbonementType;
}

export default function Abonement({ abonement }: AbonementProps) {
  const { data: user } = useAppSelector(selectUser);
  // const dispatch = useAppDispatch();
  const [freeze, setFreeze] = useState<boolean>(abonement.paused);

  function handleClick() {
    if (abonement.paused) {
      console.log("Abonement was frozen already, other actions forbidden!");
    } else {
      setFreeze((prev) => !prev);
      // dispatch(updateAbonement(abonement.id, { updateType: "freeze" }));
    }
  }

  return (
    <div className="abonement card-element">
      <div className="abonement__info">
        <div className="abonement__status status">{abonement.status}</div>
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
            {user?.role === "admin" && (
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
        {abonement.history &&
          (abonement.history.length > 0
            ? abonement.history.map((el) => (
                <HistoryElement key={el.id} data={el} trainer={false} />
              ))
            : null)}
      </div>
    </div>
  );
}
