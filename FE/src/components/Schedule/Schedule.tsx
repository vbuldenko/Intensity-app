import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { useEffect, useState } from "react";
import MonthView from "./Month";
import WeekView from "./Week";
import SelectedDayTrainings from "./SelectedDayTrainings/SelectedDayTrainings";
import "./Schedule.scss";
import WeekDaysNames from "./elements/WeekDays/WeekDays";
import CalendarNavbar from "./elements/Navbar/CalendarNavbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTrainings } from "../../features/trainings/trainingSlice";
import { fetchTrainings } from "../../features/trainings/trainingThunk";

export default function Schedule() {
  const trainings = useAppSelector(selectTrainings);
  const dispatch = useAppDispatch();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [scheduleView, setScheduleView] = useState("month");
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const selectedDayTrainings = trainings
    .filter((training) => isSameDay(parseISO(training.date), selectedDay))
    .sort((a, b) => a.time.slice(0, 2) - b.time.slice(0, 2));

  function handleViewChange(event) {
    setScheduleView(event.target.value);
  }

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  useEffect(() => {
    if (!trainings.length) {
      dispatch(fetchTrainings());
    }
  }, []);

  return (
    <section className="schedule">
      <div className="schedule__calendar calendar card-element">
        <CalendarNavbar
          firstDayCurrentMonth={firstDayCurrentMonth}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
          view={scheduleView}
          handleViewChange={handleViewChange}
        />
        <WeekDaysNames />
        {scheduleView === "month" ? (
          <MonthView
            days={days}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            trainings={trainings}
          />
        ) : (
          <WeekView
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            trainings={trainings}
          />
        )}
      </div>
      <SelectedDayTrainings trainings={selectedDayTrainings} />
    </section>
  );
}
