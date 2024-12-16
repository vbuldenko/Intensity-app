import { useState, useCallback, useEffect } from "react";
import "./Abonement.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import HistoryElement from "../Elements/HistoryElement";
import StateToggler from "../Elements/StateToggler";
import { Abonement as AbonementType } from "../../types/Abonement";
import { checkTrainingReturn } from "../../app/features/trainings/trainingThunk";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../app/features/user/userSlice";

interface AbonementProps {
  abonement: AbonementType;
  userRole?: string;
}

export default function Abonement({ abonement, userRole }: AbonementProps) {
  const { data: user } = useAppSelector(selectUser);
  const { t } = useTranslation();
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
  }, [abonement.visitedTrainings.length, dispatch]);

  return (
    <div className="abonement">
      <div className="abonement__info">
        <div className="flex items-center justify-between">
          <div
            className={classNames("abonement__status status", {
              status: abonement.status === "active",
              "status--red":
                abonement.status === "ended" || abonement.status === "expired",
            })}
          >
            {abonement.status}
          </div>

          {user?.role === "admin" && (
            <div>
              id: <span className="text-amber-600">{abonement.id}</span>
            </div>
          )}
        </div>

        <div className="abonement__container">
          <div>
            <b>{t("abonement.amount")}</b> {abonement.amount}
          </div>
          <div>
            <div>
              <b>{t("abonement.left")}</b>{" "}
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
            <b>{t("abonement.from")}</b>{" "}
            {abonement.activatedAt ? abonement.activatedAt.slice(0, 10) : null}
          </div>
          <div>
            <b>{t("abonement.to")}</b>{" "}
            {abonement.expiratedAt ? abonement.expiratedAt.slice(0, 10) : null}
          </div>
          <div>
            <b>{t("abonement.purchaseDate")}</b>{" "}
            {abonement.createdAt.slice(0, 10)}
          </div>
        </div>
      </div>
      <div className="abonement__history">
        <h2 className="abonement__title abonement__history-title">
          {t("abonement.history")}
        </h2>
        <div className="abonement__container">
          {abonement.visitedTrainings.length > 0 ? (
            abonement.visitedTrainings.map((el) => (
              <HistoryElement key={el.id} data={el} trainer={false} />
            ))
          ) : (
            <p className="flex-1 text-gray-300">{t("abonement.noHistory")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
