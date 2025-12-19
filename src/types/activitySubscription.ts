// src/types/activitySubscription.ts
export interface ActivitySubscriptionPostDTO {
  userId: string;
  activityId: number;
  originalStartUtc: string; // ISO string from backend, e.g. "2025-12-10T15:30:00+00:00"
  AllOccurrences: boolean;
}

export interface ActivitySubscriptionDeleteDTO {
  userId: string;
  activityId: number;
  originalStartUtc: string; // ISO string from backend, e.g. "2025-12-10T15:30:00+00:00"
}
