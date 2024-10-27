import classNames from "classnames";
import {
  eachDayOfInterval,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Training } from "../../types/Training";
// import { classNames } from "../../utils/utils";

interface Props {
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
  trainings: Training[];
}

const WeekView: React.FC<Props> = ({
  selectedDay,
  setSelectedDay,
  trainings,
}) => {
  const weekStart = startOfWeek(selectedDay, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDay, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const colStartClasses = [
    "col-start-7",
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
  ];
  return (
    <div className="calendar__body">
      {weekDays.map((day, dayIdx) => (
        <div
          key={day.toString()}
          className={classNames(
            dayIdx === 0 && colStartClasses[getDay(day)],
            "py-1.5"
          )}
        >
          <button
            type="button"
            onClick={() => setSelectedDay(day)}
            className={classNames(
              isEqual(day, selectedDay) && "text-white",
              !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                isSameMonth(day, selectedDay) &&
                "text-gray-900",
              !isEqual(day, selectedDay) &&
                !isToday(day) &&
                !isSameMonth(day, selectedDay) &&
                "text-gray-400",
              isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
              isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
              !isEqual(day, selectedDay) && "hover:bg-gray-200",
              (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
              "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
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

export default WeekView;
