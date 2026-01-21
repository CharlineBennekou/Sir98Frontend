export interface ActivityOccurrence {
  activityId: number;
  originalStartUtc: string;

  startUtc: string;
  endUtc: string;

  title: string;
  address: string;
  image: string | null;
  link: string | null;
  description: string | null;

  instructors: {
    id: number;
    firstName: string;
    email?: string;
    number?: string;
    image?: string;
  }[];

  tag: string | null;
  cancelled: boolean;
  isSubscribed: boolean;
}


