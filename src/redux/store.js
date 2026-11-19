import { configureStore } from '@reduxjs/toolkit';

import coursesReducer from './coursesSlice';
import goalReducer from './goalSlice';

import { loadSaved, saveCourses } from '../storage';

const savedCourses = loadSaved();

export const hasSaved = savedCourses !== null;

const preloadedState = hasSaved
  ? { courses: savedCourses }
  : undefined;

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer
  },

  preloadedState
});

// Lưu dữ liệu khi danh sách môn học thay đổi
let previousCourses = store.getState().courses;

store.subscribe(() => {
  const currentCourses = store.getState().courses;

  if (currentCourses !== previousCourses) {
    previousCourses = currentCourses;
    saveCourses(currentCourses);
  }
});