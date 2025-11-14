export type Activity = {
  id: string;
  title: string;
  date: string; // ISO date or display date
  startTime?: string;
  endTime?: string;
  location?: string;
  image?: string;
  cancelled?: boolean;
};
