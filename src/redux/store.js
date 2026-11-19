import { configureStore } from '@reduxjs/toolkit';
import goalReducer from './goalSlice';

export const store = configureStore({
  reducer: {
    goal: goalReducer
  }
});
