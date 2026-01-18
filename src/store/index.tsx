import { configureStore } from '@reduxjs/toolkit';
import { api } from './apis/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // andre slices kan tilføjes her senere
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;