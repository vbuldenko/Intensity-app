import { createAsyncThunk } from "@reduxjs/toolkit";
import { trainingService } from "../../services/trainingService";
import { ErrorResponse } from "../../types/Error";
import { Training } from "../../types/Training";
import { getErrorMessage } from "../../utils/utils";

export const fetchTrainings = createAsyncThunk<
  Training[], // Return type of the successful request
  void, // Argument type (since you're not passing any arguments)
  { rejectValue: ErrorResponse } // Type for rejected value
>("trainings/fetchTrainings", async (_, { rejectWithValue }) => {
  try {
    const trainings = await trainingService.getAll();
    return trainings;
  } catch (error: any) {
    const message = getErrorMessage(error) || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});

export const reserveTraining = createAsyncThunk<
  Training, // Return type of successful request
  {
    trainingId: number;
    abonementId: number;
    updateType: string;
  }, // Arguments passed to the thunk
  { rejectValue: ErrorResponse } // Rejected value type
>(
  "trainings/reserveTraining", // Action type
  async ({ trainingId, abonementId, updateType }, { rejectWithValue }) => {
    try {
      // Make sure you're passing the correct parameters to the service
      const updatedTraining = await trainingService.reserveTraining(
        trainingId,
        abonementId,
        updateType
      );
      return updatedTraining;
    } catch (error: any) {
      // Use a utility to extract a meaningful error message
      const message = getErrorMessage(error) || "Unexpected error occurred";
      return rejectWithValue({ message });
    }
  }
);