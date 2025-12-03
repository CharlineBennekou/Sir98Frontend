import ActivityCard from '../components/activities/ActivityCard';
import { useFetchOccurrencesQuery } from '../store/apis/activityOccurrenceAPI';
import { useEffect, useState } from 'react';
import type { ActivityOccurrence } from '../types/activityOccurrence';
import './../styles/ActivityListStyle.css';
import AppHeader from "../components/layout/AppHeader";

const STORAGE_KEY = 'sir98.subscriptions';

export default function ActivityList() {
  const [daysForward, setDaysForward] = useState<number>(7); // default 7 dage
  const { data: occurrences = [], isLoading, isError } = useFetchOccurrencesQuery({ days: daysForward });
  console.log({ isLoading, isError, occurrences, daysForward });

  const [subs, setSubs] = useState<Record<string, boolean>>({});

  // --- Load subscriptions from localStorage ---
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSubs(JSON.parse(raw));
  }, []);

  // --- Save subscriptions whenever changed ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  }, [subs]);

  if (isLoading) return <p>Henter aktiviteter…</p>;
  if (isError) return <p>Kunne ikke hente aktiviteter.</p>;

  // --- Formatter dagtekst og håndter "I dag" ---
  function formatDateHeader(dateKey: string) {
    const date = new Date(dateKey);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return "I dag";

    return date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }

  // --- Gruppér aktiviteter efter dato ---
  function groupByDate(list: ActivityOccurrence[]) {
    const groups: Record<string, ActivityOccurrence[]> = {};

    list.forEach(a => {
      const d = new Date(a.startUtc);
      const key = d.toISOString().split("T")[0]; // fx "2025-02-24"

      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    return groups;
  }

  const grouped = groupByDate(occurrences);

  // --- Sorter datoer så "I dag" eller nærmeste dato står først ---
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <>
      <AppHeader title="Alle aktiviteter" />
      <div style={{ marginTop: 70 }}></div>

      {/* Dropdown til antal dage frem */}
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="days-forward" style={{ marginRight: 10 }}>Vis aktiviteter i de næste:</label>
        <select
          id="days-forward"
          value={daysForward}
          onChange={(e) => setDaysForward(Number(e.target.value))}
        >
          <option value={7}>7 dage</option>
          <option value={14}>14 dage</option>
          <option value={30}>30 dage</option>
        </select>
      </div>

      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="day-group">
          <h3 className={`day-title ${formatDateHeader(dateKey) === "I dag" ? "today" : ""}`}>
            {formatDateHeader(dateKey)}
          </h3>

          <div className="activity-grid">
            {grouped[dateKey].map((occ: ActivityOccurrence) => (
              <ActivityCard 
                key={`${occ.id}-${occ.startUtc}`}
                activity={occ}
                subscribed={!!subs[occ.id]}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
