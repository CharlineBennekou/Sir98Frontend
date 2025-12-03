import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Instructor } from '../../types/instructors';

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
baseQuery: fetchBaseQuery({
  baseUrl: 'https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/', 
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
})

export const { useFetchInstructorsQuery } = instructorsApi;
