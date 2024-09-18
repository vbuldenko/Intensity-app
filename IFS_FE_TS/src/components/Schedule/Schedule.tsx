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
import { useState } from "react";
// import { useSelector } from "react-redux";
import MonthView from "./Month";
import WeekView from "./Week";
import SelectedTrainings from "./SelectedTrainings";
import "./Schedule.scss";
import WeekDaysNames from "./elements/WeekDays/WeekDays";
import CalendarNavbar from "./elements/Navbar/CalendarNavbar";

export default function Schedule() {
  // const trainings = useSelector(({ trainings }) => trainings);
  const trainings = [];
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
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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

  return (
    <section className="schedule">
      <div className="calendar card-element">
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
      {/* <SelectedTrainings trainings={selectedDayTrainings} /> */}
    </section>
  );
}
