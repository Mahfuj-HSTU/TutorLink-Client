import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed wrappers around the standard Redux hooks.
// Always use these instead of the plain hooks from react-redux.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
