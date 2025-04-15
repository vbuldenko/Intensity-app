import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import trainingReducer from "./features/trainings/trainingSlice";
import abonementReducer from "./features/abonements/abonementSlice";
import clientReducer from "./features/users/clientSlice";
import { logOut } from "./features/user/userThunk";

const appReducer = combineReducers({
  user: userReducer,
  trainings: trainingReducer,
  abonements: abonementReducer,
  clients: clientReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action
) => {
  if (action.type === logOut.fulfilled.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
