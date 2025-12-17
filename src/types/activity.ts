import type { Instructor } from "./instructors";

export interface Activity {
  id: number;
  title: string;
  // Backend giver ISO-strings – behold dem som string
  startUtc: string;
  endUtc: string;
  address: string;
  image: string;
  link?: string;
  description?: string;
  instructors: Instructor[];
  cancelled: boolean;
  tag?: string;
  isRecurring: boolean;
  rrule?: string;
}
