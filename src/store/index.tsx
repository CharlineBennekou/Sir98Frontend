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


// import { configureStore } from '@reduxjs/toolkit';
// import { activitiesApi } from './apis/activityAPI';
// import { instructorsApi } from './apis/instructorAPI';
// import { api } from './apis/api';
// //import { activityOccurrencesApi } from './apis/activityOccurrenceAPI';
// //import { activitySubscriptionApi } from './apis/activitySubscriptionAPI';

// export const store = configureStore({
//   reducer: {
//     [activitiesApi.reducerPath]: activitiesApi.reducer,
//     [instructorsApi.reducerPath]: instructorsApi.reducer,
//     [api.reducerPath]: api.reducer,
//     //[activityOccurrencesApi.reducerPath]: activityOccurrencesApi.reducer,
//     //[activitySubscriptionApi.reducerPath]: activitySubscriptionApi.reducer,
//     // other reducers here
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//   .concat(activitiesApi.middleware, 
//     instructorsApi.middleware, 
//     api.middleware,
//     //activityOccurrencesApi.middleware, 
//     //activitySubscriptionApi.middleware,
// )});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;