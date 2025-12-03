export type ActivityOccurrence = {
  id: number;
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
    email: string;
    number: string;
    firstName: string;
    image: string;
  }[] | null;
  tags: string[];
  cancelled: boolean;
};
