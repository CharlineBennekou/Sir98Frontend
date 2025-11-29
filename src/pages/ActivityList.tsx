import ActivityCard from '../components/activities/ActivityCard'
import { useFetchActivitiesQuery } from "../store/apis/activityAPI";
import { useEffect, useState } from 'react'
import type { Activity } from '../types/activity';
import './../styles/ActivityListStyle.css';
import AppHeader from "../components/layout/AppHeader";

const STORAGE_KEY = 'sir98.subscriptions'

export default function ActivityList() {

  const { data: activities = [], isLoading, isError } = useFetchActivitiesQuery()

  const [subs, setSubs] = useState<Record<string, boolean>>({})

  // --- Load subscriptions from localStorage ---
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setSubs(JSON.parse(raw))
  }, [])

  // --- Save subscriptions whenever changed ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
  }, [subs])

  if (isLoading) return <p>Henter aktiviteter…</p>
  if (isError) return <p>Kunne ikke hente aktiviteter.</p>

  // --- Formatter dagtekst og håndter "I dag" ---
  function formatDateHeader(dateKey: string) {
    const date = new Date(dateKey)
    const today = new Date()

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    if (isToday) return "I dag"

    return date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })
  }

  // --- Gruppér aktiviteter efter dato ---
  function groupByDate(list: Activity[]) {
    const groups: Record<string, Activity[]> = {};

    list.forEach(a => {
      if (!a.startUtc) return;

      const d = new Date(a.startUtc);
      const key = d.toISOString().split("T")[0]; // fx "2025-02-24"

      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    return groups;
  }

  const grouped = groupByDate(activities);

  // --- Sorter datoer så "I dag" eller nærmeste dato står først ---
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a);
    const dateB = new Date(b);

    const diffA = Math.abs(dateA.getTime() - today.getTime());
    const diffB = Math.abs(dateB.getTime() - today.getTime());

    return diffA - diffB; // mindste forskel først
  });

  return (
    <>
      <AppHeader title="Alle aktiviteter" />
      <div style={{ marginTop: 70 }}></div>

      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="day-group">
          <h3 className={`day-title ${formatDateHeader(dateKey) === "I dag" ? "today" : ""}`}>
            {formatDateHeader(dateKey)}
          </h3>

          <div className="activity-grid">
            {grouped[dateKey].map((a: Activity) => (
              <ActivityCard 
                key={a.id}
                activity={a}
                subscribed={!!subs[a.id]}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
