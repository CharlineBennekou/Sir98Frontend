/**
 * DTO der matcher backend EditOccurrenceDto
 * Bruges KUN til create/update (POST)
 */
export interface EditOccurrenceDto {
  id: number;

  /** Identificerer hvilken session i serien der ændres */
  originalStartUtc: string;

  /** Nye tider */
  startUtc: string;
  endUtc: string;

  title: string;
  description?: string | null;
  address?: string | null;
  tag?: string | null;

  /** Matcher backend IsCancelled */
  isCancelled: boolean;
  instructorIds?: number[]; // <-- tilføjet
}
