enum WeekDays {
  SUN = "SUN",
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
}

export default function WeekDaysNames() {
  return (
    <div className="week-days-names">
      {Object.values(WeekDays).map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
}
