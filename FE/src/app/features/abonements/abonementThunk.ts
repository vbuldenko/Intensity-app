import { createAsyncThunk } from "@reduxjs/toolkit";
import { abonementService } from "../../../services/abonementService";
import { ErrorResponse } from "../../../types/Error";
import { getErrorMessage } from "../../../utils/utils";
import { Abonement } from "../../../types/Abonement";

export const fetchAbonements = createAsyncThunk<
  Abonement[], // Return type of the successful request
  void, // Argument type
  { rejectValue: ErrorResponse } // Type for rejected value
>("abonements/fetchAbonements", async (_, { rejectWithValue }) => {
  try {
    return await abonementService.getAll();
  } catch (error: any) {
    return rejectWithValue({ message: getErrorMessage(error) });
  }
});
