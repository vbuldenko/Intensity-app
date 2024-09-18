enum WeekDays {
  SUN = "SUN",
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
}
import "./WeekDays.scss";

export default function WeekDaysNames() {
  return (
    <div className="calendar__weekdays">
      {Object.values(WeekDays).map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
}
