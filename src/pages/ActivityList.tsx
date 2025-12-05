// React hooks
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import ActivityCard from '../components/activities/ActivityCard'
// Styling
import { useFetchOccurrencesQuery } from '../store/apis/api';
import type { ActivityOccurrence } from '../types/activityOccurrence';
import './../styles/ActivityListStyle.css';
// Øverste header-komponent
import AppHeader from "../components/layout/AppHeader";

// 🔍 Mapping af URL-typer → hvilke tags der tæller som training/events
const TYPE_TAG_MAP: Record<string, string[]> = {
  training: ['træning', 'træninger', 'training'],
  events: ['begivenhed', 'begivenheder', 'event', 'events'],
  mine: [] // håndteres via subs saved i localStorage
}


export default function ActivityList() {
  const [daysForward, setDaysForward] = useState<number>(14); // default 7 dage
  const { data: occurrences = [], isLoading, isError } =
  useFetchOccurrencesQuery(
    { days: daysForward, filter: null, userId: "userId" },
    { refetchOnMountOrArgChange: true }
  );

  console.log({ isLoading, isError, occurrences, daysForward });

  /* ---------------------------------------------------------
   * 1) LÆSER URL QUERY-PARAM (?type=training/events/mine)
   * --------------------------------------------------------- */
  const [params] = useSearchParams();
  const typeParam = (params.get('type') ?? '').toLowerCase();


  /* ---------------------------------------------------------
   * 4) FILTERING — BRUG useMemo (og det SKAL ligge før return)
   *    Hooks må ikke skifte rækkefølge → derfor er loading/error
   *    flyttet NED under useMemo.
   * --------------------------------------------------------- */
  const filteredOccurrences = useMemo(() => {

    // Hvis ingen ?type → vis alle aktiviteter
    if (!typeParam) return occurrences;

    // Hvis ?type=mine → returnér kun dem brugeren har “abonneret”
    if (typeParam === 'mine') {
      return occurrences.filter(a => a.isSubscribed);
    }

    // Find tags der matcher typeParam
    const expectedTags = (TYPE_TAG_MAP[typeParam] ?? []).map(t => t.toLowerCase());

    if (!expectedTags.length) return occurrences;

    // Filtrér aktiviteter ud fra tags
    return occurrences.filter((a: ActivityOccurrence) => {
      const tags = (a.tags ?? []).map(t => String(t).toLowerCase());
      return tags.some(tag => expectedTags.includes(tag));
    });

  }, [occurrences, typeParam]);  // afhængigheder


  /* ---------------------------------------------------------
   * 5) NU må vi returnere loading / error
   *    (ALLE HOOKS er blevet kaldt over dette punkt)
   * --------------------------------------------------------- */
  if (isLoading) return <p>Henter aktiviteter…</p>;
  if (isError) return <p>Kunne ikke hente aktiviteter.</p>;


  /* ---------------------------------------------------------
   * 6) FORMATÉR DATO-TEKST (f.eks. “I dag”, “mandag 25 februar”)
   * --------------------------------------------------------- */
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
      const key = d.toISOString().split("T")[0]; // f.eks. "2025-02-24"

      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    return groups;
  }

  const grouped = groupByDate(filteredOccurrences);

  // --- Sorter datoer så "I dag" eller nærmeste dato står først ---
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );


  /* ---------------------------------------------------------
   * 9) DYNAMISK SIDE-TITEL (vises i AppHeader)
   * --------------------------------------------------------- */
  const pageTitle =
    typeParam === 'training'
      ? 'Træninger'
      : typeParam === 'events'
        ? 'Begivenheder'
        : typeParam === 'mine'
          ? 'Mine aktiviteter'
          : 'Alle aktiviteter';


  /* ---------------------------------------------------------
   * 10) RENDER UI
   * --------------------------------------------------------- */
  return (
    <>
      {/* Øverste sticky header */}
      <AppHeader title={pageTitle} />
      <div style={{ marginTop: 70 }}></div>

      {/* Dropdown til antal dage frem */}
      {/* <div style={{ margin: '1rem 0' }}>
        <label htmlFor="days-forward" style={{ marginRight: 10 }}>Vis {pageTitle.toLowerCase()} i de næste:</label>
        <select
          id="days-forward"
          value={daysForward}
          onChange={(e) => setDaysForward(Number(e.target.value))}
        >
          <option value={7}>7 dage</option>
          <option value={14}>14 dage</option>
          <option value={30}>30 dage</option>
        </select>
      </div> */}

      {sortedDates.length === 0 ? (
        // Hvis ingen aktiviteter matcher filtreringen
        <p style={{ padding: 16 }}> Ingen {pageTitle.toLowerCase()} fundet.</p>
      ) : (

      sortedDates.map((dateKey) => (
        <div key={dateKey} className="day-group">
          <h3 className={`day-title ${formatDateHeader(dateKey) === "I dag" ? "today" : ""}`}>
            {formatDateHeader(dateKey)}
          </h3>
          <div className="activity-grid">
            {grouped[dateKey].map((occ: ActivityOccurrence) => (
              <ActivityCard 
                key={`${occ.id}-${occ.startUtc}`}
                activity={occ}
              />
            ))}
          </div>
        </div>
        )))
      }
    </>
  );
}
