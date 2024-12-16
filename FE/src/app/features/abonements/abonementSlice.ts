import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { fetchAbonements } from "./abonementThunk";
import { ErrorResponse } from "../../../types/Error";
import { Abonement } from "../../../types/Abonement";
import {
  checkTrainingReturn,
  reserveTraining,
} from "../trainings/trainingThunk";
import { Training } from "../../../types/Training";

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
      )
      .addCase(
        reserveTraining.fulfilled,
        (state, action: PayloadAction<{ updatedAbonement: Abonement }>) => {
          const { updatedAbonement } = action.payload;
          if (state.data) {
            const index = state.data.findIndex(
              (a) => a.id === updatedAbonement.id
            );
            if (index !== -1) {
              state.data[index] = updatedAbonement;
            }
          }
        }
      )
      .addCase(
        reserveTraining.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.error = action.payload?.message || "An unknown error occurred";
        }
      )
      .addCase(checkTrainingReturn.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkTrainingReturn.fulfilled,
        (
          state,
          action: PayloadAction<{
            abonement: Abonement;
            trainings: Training[];
          } | null>
        ) => {
          if (action.payload) {
            const { abonement } = action.payload;
            if (state.data) {
              const index = state.data.findIndex((a) => a.id === abonement.id);
              if (index !== -1) {
                state.data[index] = abonement;
              }
            }
          }
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        checkTrainingReturn.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.error = action.payload?.message || "An unknown error occurred";
        }
      );
  },
});

// export const {
// } = abonementSlice.actions;

export const selectAbonements = (state: RootState) => state.abonements.data;

export default abonementSlice.reducer;
