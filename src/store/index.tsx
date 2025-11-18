import { configureStore } from '@reduxjs/toolkit';
import { activitiesApi } from './apis/activityAPI';
import { instructorsApi } from './apis/instructorAPI';

export const store = configureStore({
  reducer: {
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    [instructorsApi.reducerPath]: instructorsApi.reducer,
    // other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(activitiesApi.middleware, instructorsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;