import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// For useSelector, it saves you the need to type (state: RootState) every time
// For useDispatch, the default Dispatch type does not know about thunks.In order to correctly dispatch thunks,
// you need to use the specific customized AppDispatch type from the store that includes the thunk middleware types,
// and use that with useDispatch.
// Adding a pre - typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed.

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
