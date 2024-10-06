import { createAsyncThunk } from "@reduxjs/toolkit";
import { abonementService } from "../../services/abonementService";
import { ErrorResponse } from "../../types/Error";
import { getErrorMessage } from "../../utils/utils";
import { Abonement } from "../../types/Abonement";

export const fetchAbonements = createAsyncThunk<
  Abonement[], // Return type of the successful request
  void, // Argument type (since you're not passing any arguments)
  { rejectValue: ErrorResponse } // Type for rejected value
>("abonements/fetchAbonements", async (_, { rejectWithValue }) => {
  try {
    const abonements = await abonementService.getAll();
    return abonements;
  } catch (error: any) {
    const message = getErrorMessage(error) || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});
