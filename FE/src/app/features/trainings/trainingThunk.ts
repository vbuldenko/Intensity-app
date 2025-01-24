import { createAsyncThunk } from "@reduxjs/toolkit";
import { trainingService } from "../../../services/trainingService";
import { ErrorResponse } from "../../../types/Error";
import { Training } from "../../../types/Training";
import { getErrorMessage } from "../../../utils/utils";
import { Abonement } from "../../../types/Abonement";

export const fetchTrainings = createAsyncThunk<
  Training[], // Return type of the successful request
  void, // Argument type (since you're not passing any arguments)
  { rejectValue: ErrorResponse } // Type for rejected value
>("trainings/fetchTrainings", async (_, { rejectWithValue }) => {
  try {
    return await trainingService.getAll();
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const reserveTraining = createAsyncThunk<
  { updatedAbonement: Abonement; updatedTraining: Training },
  {
    trainingId: number;
    abonementId: number;
    updateType: string;
  },
  { rejectValue: ErrorResponse }
>(
  "trainings/reserveTraining",
  async ({ trainingId, abonementId, updateType }, { rejectWithValue }) => {
    try {
      return await trainingService.reserveTraining(
        trainingId,
        abonementId,
        updateType
      );
    } catch (error: any) {
      return rejectWithValue({ message: getErrorMessage(error) });
    }
  }
);

export const checkTrainingReturn = createAsyncThunk<
  { abonement: Abonement; trainings: Training[] } | null,
  number | string,
  { rejectValue: ErrorResponse }
>("trainings/checkReturn", async (abonementId, { rejectWithValue }) => {
  try {
    return await trainingService.checkAndCancelNotHeld(abonementId);
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});

export const cancelTrainingByAdmin = createAsyncThunk<
  Training,
  number | string,
  { rejectValue: ErrorResponse }
>("trainings/adminCancel", async (trainingId, { rejectWithValue }) => {
  try {
    return await trainingService.cancelTraining(trainingId);
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});
