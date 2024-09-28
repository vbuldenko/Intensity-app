import axiosClient from "../api/axiosClient";
import { Abonement } from "../types/Abonement";

function add(newAbonement: Abonement): Promise<Abonement> {
  return axiosClient.post(`/abonements`, newAbonement);
}

export const abonementService = {
  add,
};
