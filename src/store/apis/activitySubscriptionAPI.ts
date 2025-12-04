import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ActivitySubscription } from "../../types/activitySubscription";
export const activitySubscriptionApi = createApi({
  reducerPath: 'activitySubscriptionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7275/api',
  }),

  endpoints: (build) => ({

    // POST https://localhost:7275/api/ActivitySubscription
    subscribeToOccurrence: build.mutation<void, ActivitySubscription>({ //Expects ActivitySubscription object as body
      query: (body) => ({
        url: 'ActivitySubscription',
        method: 'POST',
        body,
      }),
    }),

    // DELETE https://localhost:7275/api/ActivitySubscription
    unsubscribeFromOccurrence: build.mutation<void, ActivitySubscription>({ //Expects ActivitySubscription object as body
      query: (body) => ({
        url: 'ActivitySubscription',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useSubscribeToOccurrenceMutation: useSubscribeToOccurrence,
  useUnsubscribeFromOccurrenceMutation: useUnsubscribeFromOccurrence,
} = activitySubscriptionApi;
