import axiosClient from "../api/axiosClient";
import { Abonement } from "../types/Abonement";
import { Training } from "../types/Training";

function initializeWeek(day: number): Promise<void> {
  return axiosClient.post("/trainings/initialization", { day });
}
function getAll(): Promise<Training[]> {
  return axiosClient.get("/trainings");
}

function addTraining(newTraining: Training): Promise<void> {
  return axiosClient.post(`/trainings`, newTraining);
}

function updateTraining(
  trainingId: number,
  updatedTraining: Partial<Training>
): Promise<void> {
  return axiosClient.put(`/trainings/${trainingId}`, updatedTraining);
}

function reserveTraining(
  trainingId: number,
  abonementId: number,
  updateType: string
): Promise<{ updatedAbonement: Abonement; updatedTraining: Training }> {
  return axiosClient.patch(
    `/trainings?abonementId=${abonementId}&trainingId=${trainingId}`,
    { updateType }
  );
}
function checkAndCancelNotHeld(abonementId: number): Promise<void> {
  return axiosClient.patch(`/trainings/cancel-unheld`, { abonementId });
}

function deleteTraining(trainingId: number): Promise<void> {
  return axiosClient.delete(`/trainings/${trainingId}`);
}

export const trainingService = {
  initializeWeek,
  getAll,
  addTraining,
  updateTraining,
  reserveTraining,
  checkAndCancelNotHeld,
  deleteTraining,
};
