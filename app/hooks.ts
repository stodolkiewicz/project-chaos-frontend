import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`

// 1. Helps in detecting non-existing actions and the type of action parameters
// ---- useAppDispatch(setSOMETHINGNOTEXISTING(user)); -> compile error
// ---- useAppDispatch(setUser(user: Incompatible-type)); -> compile error
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 2. Helps in detecting the structure of the whole state of application
// ---- Knows that state has user property and knows its structure
// ---- const userData = useAppSelector(state => state.user);
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
