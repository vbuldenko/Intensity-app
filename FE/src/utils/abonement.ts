import { Abonement } from "../types/Abonement";

export type ViewOption = "all" | "active" | "expired" | "inactive";

export function filterAbonements(
  abonements: Abonement[],
  viewOption: ViewOption
): Abonement[] {
  const expirationDateFilter = (abonement: Abonement): boolean => {
    const expirationDate = abonement.expiratedAt
      ? new Date(abonement.expiratedAt)
      : null;

    switch (viewOption) {
      case "active":
        return abonement.status === "active";
      case "expired":
        return abonement.status === "expired" || abonement.status === "ended";
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
        new Date(a.activatedAt).getTime() - new Date(b.activatedAt).getTime()
    ); // Most late active first

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
