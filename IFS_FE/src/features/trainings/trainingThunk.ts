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
