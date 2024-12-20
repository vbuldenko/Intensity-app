import axiosClient from "../api/axiosClient";
import { Abonement as OriginalAbonement } from "../types/Abonement";

interface Abonement extends OriginalAbonement {
  clientId: number;
}

function getAll(): Promise<Abonement[]> {
  return axiosClient.get("/abonements");
}

function add(newAbonement: Partial<Abonement>): Promise<OriginalAbonement> {
  return axiosClient.post(`/abonements`, newAbonement);
}

export const abonementService = {
  getAll,
  add,
};
