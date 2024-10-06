import axiosClient from "../api/axiosClient";
import { Abonement } from "../types/Abonement";

function getAll(): Promise<Abonement[]> {
  return axiosClient.get("/abonements");
}

function add(newAbonement: Abonement): Promise<Abonement> {
  return axiosClient.post(`/abonements`, newAbonement);
}

export const abonementService = {
  getAll,
  add,
};
