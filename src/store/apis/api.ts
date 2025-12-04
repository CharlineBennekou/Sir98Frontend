import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ActivityOccurrence } from '../../types/activityOccurrence';
import type { ActivitySubscription } from '../../types/activitySubscription';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7275/api/',
  }),

  // we'll use this so mutations can tell RTKQ:
  // "the occurrences list is stale, please refetch it"
  tagTypes: ['Occurrences'],

  endpoints: (builder) => ({

    // GET /activity-occurrences?.days= &filter= &userId=
    fetchOccurrences: builder.query<
      ActivityOccurrence[],
      { days?: number; filter?: string | null; userId?: string | null } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.days) query.append('days', params.days.toString());

        if (params?.filter != null && params.filter !== '') {
          query.append('filter', params.filter);
        }

        if (params?.userId != null && params.userId !== '') {
          query.append('userId', params.userId);
        }

        return {
          url: `activity-occurrences?${query.toString()}`,
          method: 'GET',
        };
      },

      transformResponse: (response: any) => {
        console.log('API raw response:', response);

        const list: any[] = Array.isArray(response) ? response : [];
        return list.map((o) => ({
          id: o.activityId,
          originalStartUtc: o.originalStartUtc,
          startUtc: o.startUtc,
          endUtc: o.endUtc,
          title: o.title,
          address: o.address,
          image: o.image ?? null,
          link: o.link ?? null,
          description: o.description ?? null,
          instructors:
            o.instructors?.map((inst: any) => ({
              id: inst.id,
              email: inst.email,
              number: inst.number,
              firstName: inst.firstName,
              image: inst.image,
            })) ?? [],
          tags: o.tags ?? [],
          cancelled: o.cancelled,
          isSubscribed: o.isSubscribed,
        }));
      },

      // let RTK Query know this query provides the "Occurrences" list
      providesTags: (result) =>
        result
          ? [
              ...result.map((occ) => ({
                type: 'Occurrences' as const,
                id: occ.id,
              })),
              { type: 'Occurrences' as const, id: 'LIST' },
            ]
          : [{ type: 'Occurrences' as const, id: 'LIST' }],
    }),

    // POST /ActivitySubscription
    subscribeToOccurrence: builder.mutation<void, ActivitySubscription>({
      query: (body) => ({
        url: 'ActivitySubscription',
        method: 'POST',
        body,
      }),

      // tell RTKQ: "the occurrences list is stale → refetch it"
      invalidatesTags: [{ type: 'Occurrences', id: 'LIST' }],
    }),

    // DELETE /ActivitySubscription
    unsubscribeFromOccurrence: builder.mutation<void, ActivitySubscription>({
      query: (body) => ({
        url: 'ActivitySubscription',
        method: 'DELETE',
        body,
      }),

      // tell RTKQ: "the occurrences list is stale → refetch it"
      invalidatesTags: [{ type: 'Occurrences', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchOccurrencesQuery,
  useSubscribeToOccurrenceMutation: useSubscribeToOccurrence,
  useUnsubscribeFromOccurrenceMutation: useUnsubscribeFromOccurrence,
} = api;
