import { ScheduleTraining } from "../types/Schedule";
import axiosClient from "../api/axiosClient";

function getSchedule(): Promise<ScheduleTraining[]> {
  return axiosClient.get("/schedule");
}

function addTraining(
  newTraining: Partial<ScheduleTraining>
): Promise<ScheduleTraining> {
  return axiosClient.post(`/schedule`, newTraining);
}

function updateTraining(
  trainingId: string,
  updatedTraining: Partial<ScheduleTraining>
): Promise<ScheduleTraining> {
  return axiosClient.put(`/schedule/${trainingId}`, updatedTraining);
}

function deleteTraining(trainingId: string): Promise<void> {
  return axiosClient.delete(`/schedule/${trainingId}`);
}

export const scheduleService = {
  getSchedule,
  addTraining,
  updateTraining,
  deleteTraining,
};
