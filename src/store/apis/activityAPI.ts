import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Activity } from '../../types/activity';

export const activitiesApi = createApi({
  reducerPath: 'activitiesApi',
baseQuery: fetchBaseQuery({
  baseUrl: 'https://sir98backend20251119084937-b4g4eucyewf0dvf7.canadacentral-01.azurewebsites.net/api/',
}),
endpoints: (builder) => ({
  fetchActivities: builder.query<Activity[], void>({
    query: () => ({
      url: 'activity',
      method: 'GET'
    }),
          transformResponse: (response: any[]) => {
          return response.map(activity => ({
            id: activity.id,
            title: activity.title,
            start: activity.start,  // <-- behold som string
            end: activity.end,      // <-- behold som string
            address: activity.address,
            image: activity.image,
            link: activity.link,
            cancelled: activity.cancelled,
            instructors: activity.instructors?.map((inst: any) => ({
              id: inst.id,
              email: inst.email,
              number: inst.number,
              firstName: inst.firstName,
              image: inst.image
              })) ?? []
          })) as Activity[];
      }
    }),
  }),
});

export const { useFetchActivitiesQuery } = activitiesApi;
