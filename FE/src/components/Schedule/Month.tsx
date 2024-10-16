import classNames from "classnames";
import {
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { Training } from "../../types/Training";
// import { classNames } from "../../utils/utils";

interface MonthViewProps {
  days: Date[];
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
  trainings: Training[];
}

const MonthView: React.FC<MonthViewProps> = ({
  days,
  selectedDay,
  setSelectedDay,
  trainings,
}) => {
  const monthStart = [
    "",
    "calendar__day--start-2",
    "calendar__day--start-3",
    "calendar__day--start-4",
    "calendar__day--start-5",
    "calendar__day--start-6",
    "calendar__day--start-7",
  ];

  return (
    <div className="calendar__body">
      {days.map((day, dayIdx) => (
        <div
          key={day.toString()}
          className={classNames(
            "calendar__day",
            dayIdx === 0 && monthStart[getDay(day)]
          )}
        >
          <button
            onClick={() => setSelectedDay(day)}
            className={classNames(
              isEqual(day, selectedDay) && "text-white",
              !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                !isSameMonth(day, selectedDay) &&
                "text-gray-400",
              isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
              isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
              !isEqual(day, selectedDay) && "hover:bg-gray-200",
              (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
              "calendar__day-button"
            )}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>

          <div className="w-1 h-1 mx-auto mt-1">
            {trainings.some((training) =>
              isSameDay(parseISO(training.date), day)
            ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
