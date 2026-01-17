
import type { EditOccurrenceDto } from './../types/newEditOccurrenceDTO';
import type { ActivityOccurrence } from './../types/activityOccurrence';


export function toEditOccurrenceDto(
  occ: ActivityOccurrence
): EditOccurrenceDto {
  return {
    activityId: occ.activityId,
    originalStartUtc: occ.originalStartUtc,
    startUtc: occ.startUtc,
    endUtc: occ.endUtc,
    title: occ.title,
    description: occ.description,
    address: occ.address,
    tag: occ.tag,
    isCancelled: occ.cancelled, // 🔑 vigtig mapping
  };
}
