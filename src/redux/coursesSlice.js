import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],

  reducers: {
    setCourses: (state, action) => {
      return Array.isArray(action.payload)
        ? action.payload.map((course) => ({ ...course }))
        : [];
    },

    addCourse: (state, action) => {
      const maxId = state.reduce(
        (max, course) => Math.max(max, Number(course.id) || 0),
        0
      );

      state.push({
        ...action.payload,
        id: maxId + 1
      });
    },

    removeCourse: (state, action) => {
      const index = state.findIndex(
        (course) => course.id === action.payload
      );

      if (index !== -1) {
        state.splice(index, 1);
      }
    },

    setCourseScore: (state, action) => {
      const course = state.find(
        (item) => item.id === action.payload.id
      );

      if (course) {
        course.score = action.payload.score;
      }
    }
  }
});

export const {
  setCourses,
  addCourse,
  removeCourse,
  setCourseScore
} = coursesSlice.actions;

export default coursesSlice.reducer;