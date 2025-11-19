import ActivityCard from './ActivityCard'
import { useFetchActivitiesQuery } from "../../store/apis/activityAPI";
import { useEffect, useState } from 'react'
import type { Activity } from '../../types/activity';

const STORAGE_KEY = 'sir98.subscriptions'

export default function ActivityList() {
  const { data: activities = [], isLoading, isError } = useFetchActivitiesQuery()

  const [subs, setSubs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setSubs(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
  }, [subs])

  function toggle(id: string) {
    setSubs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (isLoading) return <p>Henter aktiviteter…</p>
  if (isError) return <p>Kunne ikke hente aktiviteter.</p>

  return (
    <div>
      <h2>Aktiviteter</h2>
      <div>
        {activities.map((a: Activity) => (
          <ActivityCard 
            key={a.id}
            activity={a}
            subscribed={!!subs[a.id]}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  )
}
