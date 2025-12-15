import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Instructor } from '../../types/instructors';

export const instructorsApi = createApi({
  reducerPath: 'instructorsApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      'https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/',
  }),
  tagTypes: ['Instructor'],
  endpoints: (builder) => ({
    // ---------- Hent alle instruktører ----------
    fetchInstructors: builder.query<Instructor[], void>({
      query: () => ({
        url: 'instructor',
        method: 'GET',
      }),
      transformResponse: (response: any[]) => {
        return response.map((instructor) => ({
          id: instructor.id,
          firstName: instructor.firstName,
          email: instructor.email,
          number: instructor.number,
          image: instructor.image,
        })) as Instructor[];
      },
      providesTags: (result, _error, _arg) =>
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

    // ---------- Opret instruktør ----------
    createInstructor: builder.mutation<Instructor, Omit<Instructor, 'id'>>({
      query: (instructor) => ({
        url: 'instructor',
        method: 'POST',
        body: instructor,
      }),
      invalidatesTags: [{ type: 'Instructor', id: 'LIST' }],
    }),

    // ---------- Hent instruktør via id ----------
    fetchInstructorById: builder.query<Instructor, number>({
      query: (id) => ({
        url: `instructor/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Instructor', id },
      ],
    }),

    // ---------- Opdater instruktør ----------
    updateInstructor: builder.mutation<Instructor, Instructor>({
      query: (instructor) => ({
        url: `instructor/${instructor.id}`,
        method: 'PUT',
        body: instructor,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Instructor', id: arg.id },
      ],
    }),

    // ---------- Slet instruktør ----------
    deleteInstructor: builder.mutation<void, number>({
      query: (id) => ({
        url: `instructor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Instructor', id },
      ],
    }),
  }),
});

export const {
  useFetchInstructorsQuery,
  useCreateInstructorMutation,
  useFetchInstructorByIdQuery,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorsApi;
