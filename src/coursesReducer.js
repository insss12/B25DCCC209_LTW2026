export function coursesReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return Array.isArray(action.payload)
        ? action.payload.map((course) => ({ ...course }))
        : [];

    case 'ADD': {
      const maxId = state.reduce(
        (max, course) => Math.max(max, Number(course.id) || 0),
        0
      );

      return [...state, { ...action.payload, id: maxId + 1 }];
    }

    case 'REMOVE':
      return state.filter((course) => course.id !== action.payload);

    case 'SET_SCORE':
      return state.map((course) =>
        course.id === action.payload.id
          ? { ...course, score: action.payload.score }
          : course
      );

    default:
      return state;
  }
}
