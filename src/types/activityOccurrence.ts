export interface ActivityOccurrence {
  /** Unik identitet for én session */
  id: string;

  /** Serie-id */
  activityId: number;

  /** Bruges til redigering og subscriptions */
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

// export interface UpdateOccurrenceDTO {
//   activityId: number;           // ID på aktiviteten
//   originalStartUtc: string;     // Den originale startdato/tid for sessionen
//   startUtc: string;             // Ny startdato/tid
//   endUtc: string;               // Ny slutdato/tid
//   title: string;
//   address?: string;
//   description?: string;
//   image?: string | null;
//   link?: string | null;
//   cancelled?: boolean;
//   tag?: string | null;
//   instructorIds?: number[];
// }

