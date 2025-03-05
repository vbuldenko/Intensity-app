import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import React from "react";
import CustomSelect from "../../../../components/Buttons/CustomSelect";
import { enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import ukCustom from "../../../../locales/ukCustom";

interface CalendarNavbarProps {
  firstDayCurrentMonth: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  view: "month" | "week";
  handleViewChange: (value: "month" | "week") => void;
}

const CalendarNavbar: React.FC<CalendarNavbarProps> = ({
  firstDayCurrentMonth,
  previousMonth,
  nextMonth,
  view,
  handleViewChange,
}) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language === "ua" ? ukCustom : enUS;

  const buttonNames = [
    { value: "month", label: t("calendar.month") },
    { value: "week", label: t("calendar.week") },
  ];

  return (
    <div className="calendar__navbar">
      <button className="calendar__navbar-button" onClick={previousMonth}>
        <ChevronLeftIcon className="calendar__navbar-icon" />
      </button>
      <h3 className="calendar__title capitalize">
        {format(firstDayCurrentMonth, "MMMM yyyy", {
          locale,
        })}
      </h3>
      <button className="calendar__navbar-button" onClick={nextMonth}>
        <ChevronRightIcon className="calendar__navbar-icon" />
      </button>
      <CustomSelect
        value={view}
        options={buttonNames}
        onChange={handleViewChange}
      />
    </div>
  );
};

export default CalendarNavbar;
