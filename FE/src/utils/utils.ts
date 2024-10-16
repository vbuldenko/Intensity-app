import classNames from "classnames";
import { ScheduleTraining } from "../types/Schedule";

export const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames("nav__link", {
    active: isActive,
  });

export const scrollToTop = () => window.scrollTo(0, 0);
// export const scrollOnTop = (point = 0) =>
//   window.scrollTo({ top: point, behavior: 'smooth' });

export const getLatestByParam = <T extends Record<string, any>>(
  arrayData: T[],
  param: keyof T
) => {
  if (arrayData.length === 0) {
    return [];
  }

  const maxParam = arrayData.reduce(
    (max, element) => (element[param] > max ? element[param] : max),
    arrayData[0][param]
  );

  return arrayData
    .filter((element) => element[param] === maxParam)
    .slice(0, 20);
};

export const sortByParam = <T extends Record<string, any>>(
  arrayData: T[],
  param: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return arrayData.slice().sort((a, b) => {
    if (a[param] > b[param]) {
      return order === "asc" ? 1 : -1;
    }
    if (a[param] < b[param]) {
      return order === "asc" ? -1 : 1;
    }
    return 0;
  });
};

export const adaptivePaginationPages = (
  pages: number[],
  activePage: number
) => {
  if (pages.length <= 7) {
    return pages;
  }

  const emptyElement = ["..."];
  const activePageIndex = pages.indexOf(activePage);
  const fifthFromEndIndex = pages.length - 1 - 4;

  if (activePageIndex < 4) {
    const firstPart = pages.slice(0, 5);

    return [...firstPart, ...emptyElement, pages[pages.length - 1]];
  }

  if (activePageIndex >= 4 && activePageIndex <= fifthFromEndIndex) {
    const middlePart = pages.slice(activePageIndex - 1, activePageIndex + 2);

    return [
      pages[0],
      ...emptyElement,
      ...middlePart,
      ...emptyElement,
      pages[pages.length - 1],
    ];
  }

  if (activePageIndex > fifthFromEndIndex) {
    const lastPart = pages.slice(fifthFromEndIndex);

    return [pages[0], ...emptyElement, ...lastPart];
  }

  return [];
};

export function getErrorMessage(error: any): string {
  const errors = error?.response?.data?.errors;

  if (
    errors &&
    typeof errors === "object" &&
    Object.entries(errors).length > 0
  ) {
    const [field, message] = Object.entries(errors)[0];
    return `${field.toLocaleUpperCase()}: ${message}`;
  }

  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred"
  );
}

export function groupTrainingsByDay(trainings: ScheduleTraining[]) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return daysOfWeek.map((day) => ({
    day,
    trainings: trainings.filter((training) => training.day === day),
  }));
}

export function isTomorrow(dateToCheck: Date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    tomorrow.getDate() === dateToCheck.getDate() &&
    tomorrow.getMonth() === dateToCheck.getMonth() &&
    tomorrow.getFullYear() === dateToCheck.getFullYear()
  );
}

export function reservationAccess(
  currentDateTime: Date,
  scheduledTime: Date,
  reservedPlaces: number,
  hoursDiff: number
) {
  const currentHour = currentDateTime.getHours();
  // console.log("Is tomorrosW: ", isTomorrow(scheduledTime));

  // Rule 1: If scheduled time has passed, reservation is closed
  if (currentDateTime >= scheduledTime) {
    return false;
  }

  // Rule 2: Client cannot reserve next day trainings scheduled at 9 a.m, 10 a.m, and 11 a.m after 9 p.m of the current day
  if (
    isTomorrow(scheduledTime) &&
    [9, 10, 11].includes(scheduledTime.getHours()) &&
    currentHour >= 21 &&
    reservedPlaces <= 1
  ) {
    return false;
  }

  // Rule 3: Client cannot reserve less than 3 hours before scheduled training
  if (hoursDiff <= 3) {
    if (reservedPlaces < 2) {
      return false; // Not allowed to reserve less than 3 hours before if there are less than two places reserved
    }
  }

  if (
    currentDateTime.getDate() === scheduledTime.getDate() &&
    currentHour < 8 &&
    [9, 10, 11].includes(scheduledTime.getHours()) &&
    reservedPlaces <= 1
  ) {
    return false; // Not allowed to reserve morning trainings if there are less than two places reserved
  }

  // If none of the above conditions are met, reservation is allowed
  return true;
}
