import axiosClient from "../api/axiosClient";
import { Training } from "../types/Training";

function initializeWeek(): Promise<void> {
  return axiosClient.post("/trainings/initialization");
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
  updateType: string,
): Promise<void> {
  return axiosClient.patch(`/trainings?abonementId=${abonementId}&trainingId=${trainingId}`, { updateType });
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
  deleteTraining,
};
