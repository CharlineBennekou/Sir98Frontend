// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { ActivityOccurrence } from "../../types/activityOccurrence";

// export const activityOccurrencesApi = createApi({
//   reducerPath: "activityOccurrencesApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl:
//       "https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/",
//       //"https://localhost:7275/api/",

//   }),
//   endpoints: (builder) => ({
//     fetchOccurrences: builder.query<ActivityOccurrence[], { days?: number; filter?: string | null; userId?: string | null } | void>({
//       query: (params) => {
//         const query = new URLSearchParams();
//         if (params?.days) query.append("days", params.days.toString());
        
//         if (params?.filter != null && params.filter !== "") {
//           query.append("filter", params.filter);
//         }

//         if (params?.userId != null && params.userId !== "") {
//           query.append("userId", params.userId);
//         }

//         return {
//           url: `activity-occurrences?${query.toString()}`,
//           method: "GET",
//         };
//       },
//       transformResponse: (response: any) => {
//         console.log("API raw response:", response);

//         const list: any[] = Array.isArray(response) ? response : [];
//         return list
//           .map((o) => ({
//             id: o.activityId,
//             originalStartUtc: o.originalStartUtc,
//             startUtc: o.startUtc,
//             endUtc: o.endUtc,
//             title: o.title,
//             address: o.address,
//             image: o.image ?? null,
//             link: o.link ?? null,
//             description: o.description ?? null,
//             instructors: o.instructors?.map((inst: any) => ({
//               id: inst.id,
//               email: inst.email,
//               number: inst.number,
//               firstName: inst.firstName,
//               image: inst.image,
//             })) ?? [],
//             tag: o.tag ?? null,
//             cancelled: o.cancelled,
//             isSubscribed: o.isSubscribed,
//           }));
//       },
//     }),
//   }),
// });

// export const { useFetchOccurrencesQuery } = activityOccurrencesApi;
