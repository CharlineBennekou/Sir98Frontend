import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ActivityOccurrence } from "../../types/activityOccurrence";

export const activityOccurrencesApi = createApi({
  reducerPath: "activityOccurrencesApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/",
  }),
  endpoints: (builder) => ({
    fetchOccurrences: builder.query<ActivityOccurrence[], { days?: number } | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.days) query.append("days", params.days.toString());

        return {
          url: `activity-occurrences?${query.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        console.log("API raw response:", response);

        const list: any[] = Array.isArray(response) ? response : [];
        return list
          .map((o) => ({
            id: o.activityId,
            originalStartUtc: o.originalStartUtc,
            startUtc: o.startUtc,
            endUtc: o.endUtc,
            title: o.title,
            address: o.address,
            image: o.image ?? null,
            link: o.link ?? null,
            description: o.description ?? null,
            instructors: o.instructors?.map((inst: any) => ({
              id: inst.id,
              email: inst.email,
              number: inst.number,
              firstName: inst.firstName,
              image: inst.image,
            })) ?? [],
            tags: o.tags ?? [],
            cancelled: o.cancelled,
          }))
          .sort(
            (a, b) =>
              new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime()
          );
      },
    }),
  }),
});

export const { useFetchOccurrencesQuery } = activityOccurrencesApi;
