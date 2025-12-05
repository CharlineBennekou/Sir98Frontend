import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Activity } from '../../types/activity';
import type { CreateActivityDTO } from '../../types/activityDTO';

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/",
  }),
  endpoints: (builder) => ({
    fetchActivities: builder.query<Activity[], void>({
      query: () => ({
        url: "activity",
        method: "GET",
      }),
      transformResponse: (response: any[]) => {
        return response.map((a) => ({
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

          tags: a.tags ?? [],

          isRecurring: a.isRecurring,
          rrule: a.rrule ?? null,
        }));
      },
    }),
    createActivity : builder.mutation<Activity, CreateActivityDTO>({
      query: (newActivity) => ({
        url: "activity",
        method: "POST",
        body: newActivity,
      }),
    }),
  }),
});

export const { useFetchActivitiesQuery, useCreateActivityMutation } = activitiesApi;