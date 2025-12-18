
export type CreateActivityInstructorDTO = {
  id: number;
};

export type CreateActivityDTO = {
  title: string;
  startUtc: string;
  endUtc: string;
  address: string;
  description?: string;
  image: string;
  link?: string;
  cancelled: boolean;
  instructorids: number[];
  tag: string;
  isRecurring: boolean;
  rrule?: string;
};

export type UpdateActivityDTO = {
  id: number;
  title: string;
  startUtc: string;
  endUtc: string;
  address: string;
  description?: string;
  image: string;
  link?: string;
  cancelled: boolean;
  instructorids: number[];
  tag: string;
  isRecurring: boolean;
  rrule?: string;
};
