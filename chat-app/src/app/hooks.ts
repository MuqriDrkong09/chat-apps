import { useDispatch, useSelector } from 'react-redux';
import type {TypedUseSelectorHook} from "react-redux";
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;