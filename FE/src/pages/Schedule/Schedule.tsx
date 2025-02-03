import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import MonthView from "./Month";
import WeekView from "./Week";
import SelectedDayTrainings from "./SelectedDayTrainings/SelectedDayTrainings";
import "./Schedule.scss";
import WeekDaysNames from "./elements/WeekDays/WeekDays";
import CalendarNavbar from "./elements/Navbar/CalendarNavbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTrainings } from "../../app/features/trainings/trainingSlice";
import { fetchTrainings } from "../../app/features/trainings/trainingThunk";
import Loader from "../../components/Elements/Loader";

export default function Schedule() {
  const { t } = useTranslation();
  const { data: trainings, loading } = useAppSelector(selectTrainings);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const today = startOfToday();

  const queryParams = new URLSearchParams(location.search);
  const queryDate = queryParams.get("date");
  const initialSelectedDay = queryDate ? parseISO(queryDate) : today;

  const [selectedDay, setSelectedDay] = useState(initialSelectedDay);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [scheduleView, setScheduleView] = useState<"month" | "week">("week");
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const selectedDayTrainings = trainings
    .filter((training) => isSameDay(parseISO(training.date), selectedDay))
    .sort(
      (a, b) =>
        parseInt(a.time.slice(0, 2), 10) - parseInt(b.time.slice(0, 2), 10)
    );

  function handleViewChange(value: "month" | "week") {
    setScheduleView(value);
  }

  function previousPeriod() {
    if (scheduleView === "month") {
      const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
      setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
    } else {
      const previousWeek = add(selectedDay, { weeks: -1 });
      setSelectedDay(previousWeek);
      updateQueryParams(previousWeek);
    }
  }

  function nextPeriod() {
    if (scheduleView === "month") {
      const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
      setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    } else {
      const nextWeek = add(selectedDay, { weeks: 1 });
      setSelectedDay(nextWeek);
      updateQueryParams(nextWeek);
    }
  }

  function updateQueryParams(date: Date) {
    const formattedDate = format(date, "yyyy-MM-dd");
    queryParams.set("date", formattedDate);
    navigate({ search: queryParams.toString() });
  }

  useEffect(() => {
    if (!trainings.length) {
      dispatch(fetchTrainings());
    }
  }, []);

  useEffect(() => {
    updateQueryParams(selectedDay);
  }, [selectedDay]);

  return (
    <section className="schedule">
      <div className="schedule__calendar calendar card-element">
        <CalendarNavbar
          firstDayCurrentMonth={firstDayCurrentMonth}
          previousMonth={previousPeriod}
          nextMonth={nextPeriod}
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
            // weekDays={weekDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            trainings={trainings}
          />
        )}
      </div>
      {selectedDayTrainings.length > 0 && (
        <SelectedDayTrainings trainings={selectedDayTrainings} />
      )}
      {loading && (
        <div className="schedule__trainings flex justify-center items-center relative">
          <Loader />
          <div className="absolute w-max">Loading trainings...</div>
        </div>
      )}
      {!selectedDayTrainings.length && !loading && (
        <p className="text-center text-gray-400 col-span-full">
          {t("trainerOverview.noTrainings")}
        </p>
      )}
    </section>
  );
}
