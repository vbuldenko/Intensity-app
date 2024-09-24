import { ScheduleTraining } from "../types/Schedule";
import axiosClient from "../api/axiosClient";

// Fetch the full schedule
function getSchedule(): Promise<Record<string, ScheduleTraining[]>> {
  return axiosClient.get("/schedule");
}

// Fetch schedule for a specific day
// function getDaySchedule(day: string): Promise<Schedule[]> {
//   return axiosClient.get(`/schedule/${day}`);
// }

// Add new training to a specific day
function addTraining(newTraining: ScheduleTraining): Promise<void> {
  return axiosClient.post(`/schedule`, newTraining);
}

// Update training details for a specific day
function updateTraining(
  trainingId: number,
  updatedTraining: Partial<ScheduleTraining>
): Promise<void> {
  return axiosClient.put(`/schedule/${trainingId}`, updatedTraining);
}

// Delete a training from a specific day
function deleteTraining(trainingId: number): Promise<void> {
  return axiosClient.delete(`/schedule/${trainingId}`);
}

export const scheduleService = {
  getSchedule,
  addTraining,
  updateTraining,
  deleteTraining,
};
