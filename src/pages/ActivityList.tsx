// React hooks
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import ActivityCard from '../components/activities/ActivityCard'
// Styling
import { useFetchOccurrencesQuery } from '../store/apis/api';
import type { ActivityOccurrence } from '../types/activityOccurrence';
import './../styles/ActivityListStyle.css';
// Øverste header-komponent
import AppHeader from "../components/layout/AppHeader";
//import { isAuthenticated } from '../components/users/IsAuthenticated';
import { LuSquarePlus } from 'react-icons/lu';
import { isAuthenticated } from '../components/users/IsAuthenticated';

const TYPE_TAG_MAP: Record<string, string[]> = {
  training: ['træning', 'træninger', 'training'],
  events: ['begivenhed', 'begivenheder', 'event', 'events'],
  mine: [] // "mine" is handled specially in the code. Checks isSubscribed flag.
}


export default function ActivityList() {
  const [daysForward, setDaysForward] = useState<number>(14); // default 7 dage
  //const userId = localStorage.getItem("Email");
  const { data: occurrences = [], isLoading, isError } =
  useFetchOccurrencesQuery(
    { days: daysForward, filter: null,  userId: isAuthenticated() ? String(localStorage.getItem("Email")) : "userId" },
    { refetchOnMountOrArgChange: true }
  );

  console.log({ isLoading, isError, occurrences, daysForward });

  const [params] = useSearchParams();
  const typeParam = (params.get('type') ?? '').toLowerCase();


 
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
      const tag = (a.tag ?? "").toLowerCase();
      return expectedTags.includes(tag);
    });

  }, [occurrences, typeParam]);  // afhængigheder


  
  if (isLoading) return <p>Henter aktiviteter…</p>;
  if (isError) return <p>Kunne ikke hente aktiviteter.</p>;


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



  const pageTitle =
    typeParam === 'training'
      ? 'Træninger'
      : typeParam === 'events'
        ? 'Begivenheder'
        : typeParam === 'mine'
          ? 'Fulgte aktiviteter'
          : 'Alle aktiviteter';


 
  return (
    <>
      {/* Øverste sticky header */}
      <AppHeader title={pageTitle} />
      <div style={{ marginTop: 70 }}></div>

      

      {
        (localStorage.getItem("Role") === "Instructor") ? 
          <Link to="/create" className="create-activity-btn">
              <span className="icon-wrapper-add"><LuSquarePlus /></span>
              Opret aktivitet
          </Link>
        :
        null
    }

      {/* Dropdown til antal dage frem */}
      <div style={{ margin: '1rem 0' }}>
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
      </div>

      {sortedDates.length === 0 ? (
        // Hvis ingen aktiviteter matcher filtreringen
        <p style={{ padding: 16 }}>
          {typeParam === 'mine'
            ? 'Der er ingen fulgte aktiviteter i de næste dagse. Prøv at følge nogle aktiviteter for at få notifikationer om ændringer.'
            : `Ingen ${pageTitle.toLowerCase()} fundet.`}
        </p>
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
