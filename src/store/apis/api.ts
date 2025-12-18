import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ActivityOccurrence } from '../../types/activityOccurrence';
import type { ActivitySubscription } from '../../types/activitySubscription';
import type { PushSubscriptionDto, DeletePushSubscriptionArgs } from '../../types/PushSubscriptionDto';
import type { Activity } from '../../types/activity';
import type { CreateActivityDTO } from '../../types/activityDTO';
import type { Instructor } from '../../types/instructors';

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/',
   // baseUrl:'https://localhost:7275/api/',
  }),

  tagTypes: ['Occurrences', 'Activity', 'Instructor'],

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
          tag: o.tag ?? null,
          cancelled: o.cancelled,
          isSubscribed: o.isSubscribed,
        }));
      },

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
      invalidatesTags: [{ type: 'Occurrences', id: 'LIST' }],
    }),

    // DELETE /ActivitySubscription
    unsubscribeFromOccurrence: builder.mutation<void, ActivitySubscription>({
      query: (body) => ({
        url: 'ActivitySubscription',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'Occurrences', id: 'LIST' }],
    }),

    // POST /PushSubscription
    upsertPushSubscription: builder.mutation<void, PushSubscriptionDto>({
      query: (body) => ({
        url: 'PushSubscription',
        method: 'POST',
        body,
      }),
    }),

    // DELETE /PushSubscription?userId=&endpoint=
    deletePushSubscription: builder.mutation<void, DeletePushSubscriptionArgs>({
      query: ({ userId, endpoint }) => ({
        url: `PushSubscription?userId=${encodeURIComponent(userId)}&endpoint=${encodeURIComponent(endpoint)}`,
        method: 'DELETE',
      }),
    }),

    // ---------- ACTIVITY ----------
    fetchActivities: builder.query<Activity[], void>({
      query: () => ({
        url: 'activity',
        method: 'GET',
      }),
      transformResponse: (response: any[]) =>
        response.map((a) => ({
          id: a.id,
          title: a.title,
          startUtc: a.startUtc,
          endUtc: a.endUtc,
          address: a.address,
          image: a.image,
          link: a.link ?? null,
          description: a.description ?? null,
          instructors:
            a.instructors?.map((inst: any) => ({
              id: inst.id,
              email: inst.email,
              number: inst.number,
              firstName: inst.firstName,
              image: inst.image,
            })) ?? [],
          cancelled: a.cancelled,
          tag: a.tag ?? null,
          isRecurring: a.isRecurring,
          rrule: a.rrule ?? null,
        })),
      providesTags: [{ type: 'Activity', id: 'LIST' }],
    }),

    fetchActivityById: builder.query<Activity, number>({
      query: (id) => `activity/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Activity', id }],
    }),

    createActivity: builder.mutation<Activity, CreateActivityDTO>({
      query: (body) => ({
        url: 'activity',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Activity', id: 'LIST' }],
    }),

    updateActivity: builder.mutation<Activity, Activity>({
      query: (activity) => ({
        url: `activity/${activity.id}`,
        method: 'PUT',
        body: activity,
      }),
      invalidatesTags: (_r, _e, a) => [{ type: 'Activity', id: a.id }],
    }),

    deleteActivity: builder.mutation<void, number>({
      query: (id) => ({
        url: `activity/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Activity', id }],
    }),

    // ---------- INSTRUCTOR ----------
    fetchInstructors: builder.query<Instructor[], void>({
      query: () => 'instructor',
      transformResponse: (response: any[]) =>
        response.map((i) => ({
          id: i.id,
          firstName: i.firstName,
          email: i.email,
          number: i.number,
          image: i.image,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Instructor' as const,
                id,
              })),
              { type: 'Instructor', id: 'LIST' },
            ]
          : [{ type: 'Instructor', id: 'LIST' }],
    }),

    fetchInstructorById: builder.query<Instructor, number>({
      query: (id) => `instructor/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Instructor', id }],
    }),

    createInstructor: builder.mutation<Instructor, Omit<Instructor, 'id'>>({
      query: (body) => ({
        url: 'instructor',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Instructor', id: 'LIST' }],
    }),

    updateInstructor: builder.mutation<Instructor, Instructor>({
      query: (i) => ({
        url: `instructor/${i.id}`,
        method: 'PUT',
        body: i,
      }),
      invalidatesTags: (_r, _e, i) => [{ type: 'Instructor', id: i.id }],
    }),

    deleteInstructor: builder.mutation<void, number>({
      query: (id) => ({
        url: `instructor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Instructor', id }],
    }),

  }),
});

export const {
  // Occurrences
  useFetchOccurrencesQuery,
  useSubscribeToOccurrenceMutation: useSubscribeToOccurrence,
  useUnsubscribeFromOccurrenceMutation: useUnsubscribeFromOccurrence,
  // Push
  useUpsertPushSubscriptionMutation,
  useDeletePushSubscriptionMutation,

  // Activity
  useFetchActivitiesQuery,
  useFetchActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,

  // Instructor
  useFetchInstructorsQuery,
  useFetchInstructorByIdQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = api;
