import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { fetchAbonements } from "./abonementThunk";
import { ErrorResponse } from "../../types/Error";
import { Abonement } from "../../types/Abonement";

// Define a type for the slice state
export interface AbonementState {
  loading: boolean;
  data: Abonement[] | null;
  error: string | null;
}

// Define the initial state using that type
const initialState: AbonementState = {
  loading: false,
  data: null,
  error: null,
};

export const abonementSlice = createSlice({
  name: "abonements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbonements.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAbonements.fulfilled,
        (state, action: PayloadAction<Abonement[]>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null; // Clear the error on success
        }
      )
      .addCase(
        fetchAbonements.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

// export const {
// } = abonementSlice.actions;

export const selectAbonements = (state: RootState) => state.abonements.data;

export default abonementSlice.reducer;
