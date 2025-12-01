import type { Instructor } from "./instructor";

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
  tags?: string[];
  isRecurring: boolean;
  rrule?: string;
}
