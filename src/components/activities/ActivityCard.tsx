import '../../activities.css'
import { type Activity } from './types'


type Props = {
    activity: Activity
    subscribed: boolean
    onToggle: (id: string) => void
}

export default function ActivityCard({ activity, subscribed, onToggle }: Props) {
    return (
        <div className={`activity-card ${activity.cancelled ? 'cancelled' : ''} ${subscribed ? 'subscribed' : ''}`}>
            {activity.image && <div className="activity-image" style={{ backgroundImage: `url(${activity.image})` }} />}
            <div className="activity-body">
                <h3 className="activity-title">{activity.title}</h3>
                <div className="activity-meta">
                    <div className="activity-date">{activity.date}</div>
                    <div className="activity-time">{activity.startTime}{activity.endTime ? ` - ${activity.endTime}` : ''}</div>
                    {activity.location && <div className="activity-location">{activity.location}</div>}
                </div>
                <div className="activity-actions">
                    <label className="subscribe-label">
                        <input type="checkbox" checked={subscribed} onChange={() => onToggle(activity.id)} />
                        <span>Subscribe</span>
                    </label>
                </div>
                {activity.cancelled && <div className="cancelled-pill">AFLYST</div>}
            </div>
        </div>
    )
}
