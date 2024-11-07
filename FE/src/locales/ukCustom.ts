import { uk } from "date-fns/locale";

const ukCustom = {
  ...uk,
  localize: {
    ...uk.localize,
    month: (n: number, options: { width?: string; context?: string } = {}) => {
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
      const width = options.width ? options.width : "wide";
      return months[n];
    },
  },
};

export default ukCustom;
