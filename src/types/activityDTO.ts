
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
  instructors: CreateActivityInstructorDTO[];
  tag: string;
  isRecurring: boolean;
  rrule?: string;
};
