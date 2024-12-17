import { Abonement } from "../types/Abonement";
import { isToday, isTomorrow } from "./utils";

export type ViewOption = "all" | "active" | "expired" | "inactive";

export function filterAbonements(
  abonements: Abonement[],
  viewOption: ViewOption
): Abonement[] {
  const currentDate = new Date();

  const expirationDateFilter = (abonement: Abonement): boolean => {
    const expirationDate = abonement.expiratedAt
      ? new Date(abonement.expiratedAt)
      : null;

    switch (viewOption) {
      case "active":
        return abonement.status === "active";
      case "expired":
        return (
          (expirationDate !== null && expirationDate < currentDate) ||
          abonement.status === "ended"
        );
      case "inactive":
        return abonement.status === "inactive" && expirationDate === null;
      default: // 'all' option
        return true;
    }
  };

  return abonements.filter(expirationDateFilter);
}

export function getCurrentAbonement(
  abonements: Abonement[] | undefined
): Abonement | null {
  if (!abonements || abonements.length === 0) return null;

  // Step 1: Get active
  const activeAbonements = abonements
    .filter((abonement) => abonement.status === "active")
    .sort(
      (a, b) =>
        new Date(b.activatedAt).getTime() - new Date(a.activatedAt).getTime()
    ); // Most recent active first

  if (activeAbonements.length > 0) return activeAbonements[0];

  // Step 2: Get inactive
  const inactiveAbonement = abonements.find(
    (abonement) => abonement.status === "inactive"
  );
  if (inactiveAbonement) return inactiveAbonement;

  // Step 3: Get ended
  const endedAbonements = abonements
    .filter((abonement) => abonement.status === "ended")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ); // Most recent ended first

  return endedAbonements.length > 0 ? endedAbonements[0] : null;
}

export function isCancellationForbidden(
  updateType: string,
  hoursDiff: number,
  trainingTime: Date
): boolean {
  const currentHour = new Date().getHours();
  const isEarlyMorningTraining = [9, 10, 11].includes(trainingTime.getHours());
  const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isToday(trainingTime);

  return (
    updateType === "cancellation" &&
    (hoursDiff < 3 ||
      (isLateReservationUpdate && isEarlyMorningTraining) ||
      (isEarlyReservationUpdate && isEarlyMorningTraining))
  );
}
