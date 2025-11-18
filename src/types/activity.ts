import type { Instructor } from './/instructor';

export interface Activity1 {
  id: number;
  title: string;
  start: Date;        // convert string → Date
  end: Date;
  address: string;
  image: string;
  link: string;
  cancelled: boolean;
  instructors: Instructor[];  // convert null → []
}