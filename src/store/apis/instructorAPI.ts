import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Instructor } from '../../types/instructor';

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
baseQuery: fetchBaseQuery({
  baseUrl: 'https://sir98backend2025v2-ayf5erhdhhawcjff.canadacentral-01.azurewebsites.net/api/',
}),
endpoints: (builder) => ({
  fetchInstructors: builder.query<Instructor[], void>({
    query: () => ({
      url: 'instructor',
      method: 'GET'
    }),
      transformResponse: (response: any[]) => {
        return response.map(instructor => ({
          id: instructor.id,
          email: instructor.email,
          number: instructor.number,
          firstName: instructor.firstName,
          image: instructor.image
        })) as Instructor[];
      }
    }),
  }),
});

export const { useFetchInstructorsQuery } = instructorsApi;
