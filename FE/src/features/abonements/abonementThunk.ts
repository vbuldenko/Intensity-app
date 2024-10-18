import { createAsyncThunk } from "@reduxjs/toolkit";
import { abonementService } from "../../services/abonementService";
import { ErrorResponse } from "../../types/Error";
import { getErrorMessage } from "../../utils/utils";
import { Abonement } from "../../types/Abonement";

export const fetchAbonements = createAsyncThunk<
  Abonement[], // Return type of the successful request
  "admin" | void, // Argument type
  { rejectValue: ErrorResponse } // Type for rejected value
>("abonements/fetchAbonements", async (role, { rejectWithValue }) => {
  try {
    const abonements =
      role === "admin"
        ? await abonementService.getAll()
        : await abonementService.getAllByUser();

    return abonements;
  } catch (error: any) {
    const message = getErrorMessage(error) || "Unexpected error occurred";
    return rejectWithValue({ message });
  }
});