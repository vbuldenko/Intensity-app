import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

export default function CalendarNavbar({
  firstDayCurrentMonth,
  previousMonth,
  nextMonth,
  view,
  handleViewChange,
}) {
  return (
    <div className="calendar__navbar">
      <button className="calendar__navbar-button" onClick={previousMonth}>
        <ChevronLeftIcon className="calendar__navbar-icon" />
      </button>
      <h3 className="calendar__title calendar__title--bold">
        {format(firstDayCurrentMonth, "MMMM yyyy")}
      </h3>
      <button className="calendar__navbar-button" onClick={nextMonth}>
        <ChevronRightIcon className="calendar__navbar-icon" />
      </button>
      <select
        id="view"
        className="calendar__select"
        name="view"
        value={view}
        onChange={handleViewChange}
      >
        <option value="month">Month</option>
        <option value="week">Week</option>
      </select>
    </div>
  );
}
