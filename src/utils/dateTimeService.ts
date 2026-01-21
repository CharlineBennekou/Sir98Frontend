import { DateTime } from "luxon";

const DK_TZ = "Europe/Copenhagen";

/**
 * UTC ISO -> "YYYY-MM-DDTHH:mm" in Denmark time (for <input type="datetime-local">)
 * Example: "2026-01-20T09:00:00Z" -> "2026-01-20T10:00"
 */
export function utcIsoToDkDateTimeLocal(utcIso: string): string {
  const dt = DateTime.fromISO(utcIso, { setZone: true }) // respects Z or +00:00, etc.
    .setZone(DK_TZ);

  // This matches the required datetime-local format exactly.
  return dt.toFormat("yyyy-MM-dd'T'HH:mm");
}

/**
 * "YYYY-MM-DDTHH:mm" Denmark wall-clock -> UTC ISO for backend
 * Example: "2026-01-20T10:00" -> "2026-01-20T09:00:00.000Z"
 */
export function dkDateTimeLocalToUtcIso(dateTimeLocal: string): string {
  const dt = DateTime.fromFormat(dateTimeLocal, "yyyy-MM-dd'T'HH:mm", {
    zone: DK_TZ,
  });

  if (!dt.isValid) {
    // Helps you catch bad input early during debugging
    throw new Error(`Invalid datetime-local value: "${dateTimeLocal}" (${dt.invalidReason ?? "unknown"})`);
  }

  return dt.toUTC().toISO(); // includes milliseconds; backend usually accepts it
}
