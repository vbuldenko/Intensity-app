import "./HistoryElement.scss";

interface Data {
  date: string;
  time: string;
  type: string;
  visitors: Array<any>; // Replace 'any' with the actual type if available
  // instructor: { lastName: string };
  deducted?: boolean;
  deduction_reason?: string;
}

interface HistoryItemProps {
  data: Data;
  trainer: boolean;
}

export default function HistoryElement({ data }: HistoryItemProps) {
  return (
    <div className="history-element card-element flex-1">
      <p className="history-element__title">{data.type}</p>
      <div className="history-element__item">
        <p className="history-element__label">Date</p>
        <p className="history-element__value">{data.date.slice(0, 10)}</p>
      </div>
      <div className="history-element__item">
        <p className="history-element__label">Time</p>
        <p className="history-element__value">{data.time}</p>
      </div>
      <div className="history-element__item">
        <p className="history-element__label">Visitors</p>
        <p className="history-element__value">{data.visitors.length}</p>
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
