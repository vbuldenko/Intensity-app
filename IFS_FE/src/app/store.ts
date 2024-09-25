import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import trainingsReducer from "../features/trainings/trainingSlice";
import notificationReducer from "../features/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    trainings: trainingsReducer,
    // abonements: abonementsReducer,
    notification: notificationReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
