import { useTranslation } from "react-i18next";
import "./HistoryElement.scss";

interface Data {
  date: string;
  time: string;
  type: string;
  reservations: Array<any>; // Replace 'any' with the actual type if available
  // instructor: { lastName: string };
  deducted?: boolean;
  deduction_reason?: string;
}

interface HistoryItemProps {
  data: Data;
  trainer: boolean;
}

export default function HistoryElement({ data }: HistoryItemProps) {
  const { t } = useTranslation();
  return (
    <div className="history-element card-element flex-1">
      <p className="history-element__title">{data.type}</p>
      <div className="history-element__item">
        <p className="history-element__label">{t("history.date")}</p>
        <p className="history-element__value">{data.date.slice(0, 10)}</p>
      </div>
      <div className="history-element__item">
        <p className="history-element__label">{t("history.time")}</p>
        <p className="history-element__value">{data.time}</p>
      </div>
      <div className="history-element__item">
        <p className="history-element__label">{t("history.visitors")}</p>
        <p className="history-element__value">{data.reservations.length}</p>
      </div>
      {/* {!trainer && (
        <div className="history-element__item">
          <p className="history-element__label">Trainer ID</p>
          <p className="history-element__value">{data.instructorId}</p>
        </div>
      )} */}
    </div>
  );
}
