import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Instructor } from '../../types/activity';

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
baseQuery: fetchBaseQuery({
  baseUrl: 'http://localhost:5164/api/',
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
