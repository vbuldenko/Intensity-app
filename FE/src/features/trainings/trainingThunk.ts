import { createAsyncThunk } from "@reduxjs/toolkit";
import { trainingService } from "../../services/trainingService";
import { ErrorResponse } from "../../types/Error";
import { Training } from "../../types/Training";
import { getErrorMessage } from "../../utils/utils";
import { Abonement } from "../../types/Abonement";
import { fetchUserData } from "../user/userThunk";

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
  { updatedAbonement: Abonement; updatedTraining: Training }, // Return type of successful request
  {
    trainingId: number;
    abonementId: number;
    updateType: string;
  }, // Arguments passed to the thunk
  { rejectValue: ErrorResponse } // Rejected value type
>(
  "trainings/reserveTraining", // Action type
  async (
    { trainingId, abonementId, updateType },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Make sure you're passing the correct parameters to the service
      const updatedData = await trainingService.reserveTraining(
        trainingId,
        abonementId,
        updateType
      );
      dispatch(fetchUserData());

      return updatedData;
    } catch (error: any) {
      // Use a utility to extract a meaningful error message
      const message = getErrorMessage(error) || "Unexpected error occurred";
      return rejectWithValue({ message });
    }
  }
);

export const checkTrainingReturn = createAsyncThunk<
  { abonement: Abonement; trainings: Training[] } | null,
  number, // Argument type (abonementId)
  { rejectValue: ErrorResponse }
>(
  "trainings/checkReturn",
  async (abonementId, { dispatch, rejectWithValue }) => {
    try {
      const updatedData =
        await trainingService.checkAndCancelNotHeld(abonementId);
      dispatch(fetchUserData());

      return updatedData;
    } catch (error: any) {
      const message = getErrorMessage(error) || "Unexpected error occurred";
      return rejectWithValue({ message });
    }
  }
);
