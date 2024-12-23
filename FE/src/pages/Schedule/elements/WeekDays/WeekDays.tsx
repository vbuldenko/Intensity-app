enum WeekDays {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}
import { useTranslation } from "react-i18next";
import "./WeekDays.scss";

export default function WeekDaysNames() {
  const { t } = useTranslation();
  return (
    <div className="calendar__weekdays">
      {Object.values(WeekDays).map((day) => (
        <div key={day}>{t(`weekdays.${day}`)}</div>
      ))}
    </div>
  );
}
