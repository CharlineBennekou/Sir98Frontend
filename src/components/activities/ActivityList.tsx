import ActivityCard from './ActivityCard'
import { useFetchActivitiesQuery } from "../../store/apis/activityAPI";
import { useEffect, useState } from 'react'
import type { Activity } from '../../types/activity';
import '../../styles/ActivityListStyle.css';

const STORAGE_KEY = 'sir98.subscriptions'

export default function ActivityList() {
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

  return (
    <div>
      <h2>Aktiviteter</h2>

      {/* ⭐ UI Tabs */}
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

      {/* Aktiviteter */}
      <div className="activity-grid">
        {activities.map((a: Activity) => (
          <ActivityCard 
            key={a.id}
            activity={a}
            subscribed={!!subs[a.id]}
          />
        ))}
      </div>
    </div>
  )
}
