import { uk } from "date-fns/locale";

const ukCustom = {
  ...uk,
  localize: {
    ...uk.localize,
    month: (n: number) => {
      const months = [
        "січень",
        "лютий",
        "березень",
        "квітень",
        "травень",
        "червень",
        "липень",
        "серпень",
        "вересень",
        "жовтень",
        "листопад",
        "грудень",
      ];
      return months[n];
    },
  },
};

export default ukCustom;
