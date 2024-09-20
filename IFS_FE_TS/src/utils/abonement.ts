import { Abonement } from "../types/Abonement";

export type ViewOption = "all" | "active" | "expired" | "not activated";

export function filterAbonements(
  abonements: Abonement[],
  viewOption: ViewOption
): Abonement[] {
  const currentDate = new Date();

  const expirationDateFilter = (abonement: Abonement): boolean => {
    const expirationDate = new Date(abonement.expiratedAt);

    switch (viewOption) {
      case "active":
        return abonement.status === "active";
      case "expired":
        return expirationDate < currentDate || abonement.status === "ended";
      case "not activated":
        return abonement.status === "inactive";
      default: // 'all' option
        return true;
    }
  };

  return abonements.filter(expirationDateFilter);
}
