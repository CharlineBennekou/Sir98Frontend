import { useEffect, useState } from 'react'
import ActivityCard from './ActivityCard'
import { type Activity } from './types'
import { mockActivities } from '../../mockActivity/MockActivities'

const STORAGE_KEY = 'sir98.subscriptions'

export default function ActivityList() {
  const [activities] = useState<Activity[]>(mockActivities)
  const [subs, setSubs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSubs(JSON.parse(raw))
    } catch (e) {
      console.error('Load subs failed', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
    } catch (e) {
      console.error('Save subs failed', e)
    }
  }, [subs])

  function toggle(id: string) {
    setSubs(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      <h2>Aktiviteter</h2>
      <div>
        {activities.map(a => (
          <ActivityCard key={a.id} activity={a} subscribed={!!subs[a.id]} onToggle={toggle} />
        ))}
      </div>
    </div>
  )
}
