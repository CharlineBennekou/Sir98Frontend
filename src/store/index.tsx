import { configureStore } from '@reduxjs/toolkit';
import { activitiesApi } from './apis/activityAPI';

export const store = configureStore({
  reducer: {
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    // other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(activitiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;