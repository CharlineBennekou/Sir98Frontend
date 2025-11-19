import type { Instructor } from './/instructor';

export interface Activity {
  id: number;
  title: string;
  start?: string;  // <-- ændres fra Date til string
  end?: string;
  address?: string;
  image?: string;
  link: string;
  cancelled: boolean;
  instructors: Instructor[];
}