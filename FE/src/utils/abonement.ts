import { Abonement } from "../types/Abonement";
import { User } from "../types/User";
import { isTomorrow } from "./utils";

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
  if (!abonements || abonements.length === 0) {
    return null;
  }

  let earliestActiveAbonement: Abonement | null = null;
  let inactiveAbonement: Abonement | null = null;
  let recentlyEnded: Abonement | null = null;

  const now = new Date();

  for (const a of abonements) {
    if (a.status === "active") {
      if (
        !earliestActiveAbonement ||
        new Date(a.createdAt) < new Date(earliestActiveAbonement.createdAt)
      ) {
        earliestActiveAbonement = a; // Store the earliest purchased active abonement
      }
    }
    if (a.status === "inactive" && !inactiveAbonement) {
      inactiveAbonement = a; // Store inactive if no active is found
    }
    if (a.status === "ended") {
      const expiratedAt = new Date(a.expiratedAt);
      if (expiratedAt > now) {
        if (
          !recentlyEnded ||
          expiratedAt > new Date(recentlyEnded.expiratedAt)
        ) {
          recentlyEnded = a; // Store the most recent ended abonement that is not expired
        }
      }
    }
  }

  return earliestActiveAbonement || inactiveAbonement || recentlyEnded || null;
}

export function getAbonement(user: User): Abonement | null {
  if (!user) {
    return null;
  }

  let activeAbonement: Abonement | null = null;
  let inactiveAbonement: Abonement | null = null;
  let recentlyEnded: Abonement | null = null;

  const now = new Date();

  for (const a of user.abonements || []) {
    if (a.status === "active") {
      activeAbonement = a;
      break; // Stop when an active abonement is found
    }
    if (a.status === "inactive" && !inactiveAbonement) {
      inactiveAbonement = a; // Store inactive if no active is found
    }
    if (
      a.status === "ended" &&
      !recentlyEnded &&
      new Date(a.expiratedAt) > now
    ) {
      recentlyEnded = a; // Store the ended abonement if it's not expired
    }
  }

  return activeAbonement || inactiveAbonement || recentlyEnded || null;
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
