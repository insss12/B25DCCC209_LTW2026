import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  targetGpa: 3.2,
  remainingCredits: 12
};

const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {
    setTargetGpa: (state, action) => {
      const value = Number(action.payload);
      if (Number.isFinite(value)) {
        state.targetGpa = Math.min(4, Math.max(0, value));
      }
    },
    setRemainingCredits: (state, action) => {
      const value = Number(action.payload);
      if (Number.isFinite(value)) {
        state.remainingCredits = Math.max(0, Math.floor(value));
      }
    }
  }
});

export const { setTargetGpa, setRemainingCredits } = goalSlice.actions;
export default goalSlice.reducer;
