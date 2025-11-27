import ActivityCard from './ActivityCard'
import { useFetchActivitiesQuery } from "../../store/apis/activityAPI";
import { useEffect, useState } from 'react'
import type { Activity } from '../../types/activity';
import '../../styles/ActivityListStyle.css';
import { useNavigate } from "react-router-dom"; 

const STORAGE_KEY = 'sir98.subscriptions'

export default function ActivityList() {
  const navigate = useNavigate();
  const { data: activities = [], isLoading, isError } = useFetchActivitiesQuery()

  const [subs, setSubs] = useState<Record<string, boolean>>({})
  const [activeView, setActiveView] = useState("all") // 👈 UI state

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setSubs(JSON.parse(raw))
  }, [])

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
      if (!a.start) return;

      const d = new Date(a.start);
      const key = d.toISOString().split("T")[0]; // fx "2025-02-24"

      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });

    return groups;
  }

  const grouped = groupByDate(activities);

  return (
    <div>
      <h2 className='aktivitet-header-titel'>Aktiviteter</h2>


      {/* Opret aktivitet knap */}
      <button 
        className="create-activity-btn"
        onClick={() => navigate("/create")}
      >
      Opret aktivitet
      </button>


      {/* UI Tabs */}
      <div className="activity-tabs"> 
        <button 
          className={`tab-btn ${activeView === "all" ? "active" : ""}`}
          onClick={() => setActiveView("all")}
        >
          Alle
        </button>

        <button 
          className={`tab-btn ${activeView === "training" ? "active" : ""}`}
          onClick={() => setActiveView("training")}
        >
          Træninger
        </button>

        <button 
          className={`tab-btn ${activeView === "events" ? "active" : ""}`}
          onClick={() => setActiveView("events")}
        >
          Begivenheder
        </button>

        <button 
          className={`tab-btn ${activeView === "mine" ? "active" : ""}`}
          onClick={() => setActiveView("mine")}
        >
          Mine
        </button>
      </div>

      {/* --- Dato-grupperet liste --- */}
      {Object.entries(grouped).map(([dateKey, items]) => (
        <div key={dateKey} className="day-group">

          <h3 className={`day-title ${formatDateHeader(dateKey) === "I dag" ? "today" : ""}`}>
            {formatDateHeader(dateKey)}
          </h3>

          <div className="activity-grid">
            {items.map((a: Activity) => (
              <ActivityCard 
                key={a.id}
                activity={a}
                subscribed={!!subs[a.id]}
              />
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}
