import { useState, useCallback, useEffect } from "react";
import { ScheduleTraining } from "../types/Schedule";
import { scheduleService } from "../services/scheduleService";

export const useOptimisticSchedule = (initialSchedule: ScheduleTraining[]) => {
  const [optimisticSchedule, setOptimisticSchedule] =
    useState<ScheduleTraining[]>(initialSchedule);

  // Sync with initial schedule
  useEffect(() => {
    setOptimisticSchedule(initialSchedule);
  }, [initialSchedule]);

  const updateTraining = useCallback(
    async (training: ScheduleTraining) => {
      const originalSchedule = optimisticSchedule;
      // Apply optimistic update
      setOptimisticSchedule((prev) =>
        prev.map((t) => (t.id === training.id ? training : t))
      );

      try {
        const updatedTraining = await scheduleService.updateTraining(
          training.id,
          training
        );
        // Ensure we have the latest server data
        setOptimisticSchedule((prev) =>
          prev.map((t) => (t.id === updatedTraining.id ? updatedTraining : t))
        );
      } catch (error) {
        console.error("Failed to update training:", error);

        // Rollback on error
        setOptimisticSchedule(originalSchedule);
        throw error;
      }
    },
    [optimisticSchedule]
  );

  const deleteTraining = useCallback(
    async (id: string) => {
      const originalSchedule = optimisticSchedule;

      setOptimisticSchedule((prev) => prev.filter((t) => t.id !== id));

      try {
        await scheduleService.deleteTraining(id);
      } catch (error) {
        console.error("Failed to delete training:", error);
        setOptimisticSchedule(originalSchedule);
        throw error;
      }
    },
    [optimisticSchedule]
  );

  const addTraining = useCallback((training: ScheduleTraining) => {
    setOptimisticSchedule((prev) => [...prev, training]);
  }, []);

  return {
    optimisticSchedule,
    updateTraining,
    deleteTraining,
    addTraining,
  };
};
