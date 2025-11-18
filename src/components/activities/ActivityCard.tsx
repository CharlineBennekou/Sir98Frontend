import '../../activities.css'
import { type Activity } from './types'
import type { Activity1 } from '../../types/activity';



type Props = {
    activity: Activity
    subscribed: boolean
    onToggle: (id: string) => void

    // NEW PROP: handler that parent can use to open the dialog
    //onViewDetails?: (activity: Activity1) => void
    onViewDetails?: (activity: Activity | Activity1) => void
}

export default function ActivityCard({ activity, subscribed, onToggle, onViewDetails }: Props) {
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

                    {/* NEW: Simple "View Details" button */}
                    {/* This will later open a dialog using activity API data */}
                    <button
                        className="activity-details-btn"
                        onClick={() => onViewDetails?.(activity)}
                    >
                        View Details
                    </button>
                    {/* NEW END */}

                </div>
                {activity.cancelled && <div className="cancelled-pill">AFLYST</div>}
            </div>
        </div>
    )
}
