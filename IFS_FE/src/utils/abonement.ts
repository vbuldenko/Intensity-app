import { Abonement } from "../types/Abonement";
import { User } from "../types/User";
import { isTomorrow } from "./utils";

export type ViewOption = "all" | "active" | "expired" | "not activated";

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
      case "not activated":
        return abonement.status === "inactive" && expirationDate === null;
      default: // 'all' option
        return true;
    }
  };

  return abonements.filter(expirationDateFilter);
}

export function getAbonement(user: User): Abonement | null {
  if (!user) {
    return null;
  }

  let activeAbonement: Abonement | null = null;
  let inactiveAbonement: Abonement | null = null;

  for (const a of user.abonements || []) {
    if (a.status === "active") {
      activeAbonement = a;
      break; // Stop when an active abonement is found
    }
    if (a.status === "inactive" && !inactiveAbonement) {
      inactiveAbonement = a; // Store inactive if no active is found
    }
  }

  return activeAbonement || inactiveAbonement || null;
}

export function isCancellationForbidden(
  updateType: string,
  hoursDiff: number,
  trainingTime: Date,
  currentHour: number
): boolean {
  const trainingHour = trainingTime.getHours();

  const isEarlyMorningTraining = [9, 10, 11].includes(trainingHour);
  const isLateReservationUpdate = currentHour >= 21 && isTomorrow(trainingTime);
  const isEarlyReservationUpdate = currentHour < 8 && isEarlyMorningTraining;

  return (
    updateType === "cancellation" &&
    (hoursDiff < 3 ||
      (isLateReservationUpdate && isEarlyMorningTraining) ||
      isEarlyReservationUpdate)
  );
}
