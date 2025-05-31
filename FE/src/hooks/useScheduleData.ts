import { useState, useEffect, useTransition } from "react";
import { User } from "../types/User";
import { ScheduleTraining } from "../types/Schedule";
import { scheduleService } from "../services/scheduleService";
import { userService } from "../services/userService";

export const useScheduleData = () => {
  const [trainers, setTrainers] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleTraining[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const [scheduleData, trainersData] = await Promise.all([
          scheduleService.getSchedule(),
          userService.getTrainers(),
        ]);
        setSchedule(scheduleData);
        setTrainers(trainersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      }
    });
  }, []);

  return { trainers, schedule, setSchedule, isLoading, error };
};
