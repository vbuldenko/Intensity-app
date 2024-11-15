import { ScheduleTraining } from "../types/Schedule";
import axiosClient from "../api/axiosClient";

function getSchedule(): Promise<ScheduleTraining[]> {
  return axiosClient.get("/schedule");
}

function addTraining(newTraining: ScheduleTraining): Promise<ScheduleTraining> {
  return axiosClient.post(`/schedule`, newTraining);
}

function updateTraining(
  trainingId: number,
  updatedTraining: Partial<ScheduleTraining>
): Promise<ScheduleTraining> {
  return axiosClient.put(`/schedule/${trainingId}`, updatedTraining);
}

function deleteTraining(trainingId: number): Promise<void> {
  return axiosClient.delete(`/schedule/${trainingId}`);
}

export const scheduleService = {
  getSchedule,
  addTraining,
  updateTraining,
  deleteTraining,
};
