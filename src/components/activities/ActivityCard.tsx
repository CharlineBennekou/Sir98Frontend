import '../../styles/ActivityCarsStyle.css'
import type { Activity1 } from '../../types/activity'

type Props = {
    activity: Activity1
    subscribed: boolean
    onToggle: (id: string) => void
    onViewDetails?: (activity: Activity1) => void
}

export default function ActivityCard({ activity, subscribed, onToggle, onViewDetails }: Props) {

    const startTime = activity.start ? new Date(activity.start) : null;
    const endTime = activity.end ? new Date(activity.end) : null;

    const instructorName =
        activity.instructors?.length
            ? activity.instructors[0]?.firstName
            : "Instruktør ikke angivet"

    return (
        <div className={`activity-card ${activity.cancelled ? 'cancelled' : ''} ${subscribed ? 'subscribed' : ''}`}>
            
            {activity.image && (
                <div
                    className="activity-image"
                    style={{ backgroundImage: `url(${activity.image})` }}
                />
            )}

            <div className="activity-body">

                <h3 className="activity-title">{activity.title}</h3>

                <p className="activity-instructor">{instructorName}</p>

                {activity.address && (
                    <p className="activity-location">{activity.address}</p>
                )}

                <div className="activity-time">
                    {startTime
                        ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ""}
                    {endTime
                        ? ` - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : ""}
                </div>

                <div className="activity-actions">
                    <button
                        className="details-btn"
                        onClick={() => onViewDetails?.(activity)}
                    >
                        Se detaljer
                    </button>

                    <button
                        className={`subscribe-btn ${subscribed ? "active" : ""}`}
                        onClick={() => onToggle(activity.id.toString())}
                    >
                        {subscribed ? "Tilmeldt" : "Tilmeld dig"}
                    </button>
                </div>

                {activity.cancelled && (
                    <div className="cancelled-pill">AFLYST</div>
                )}
            </div>
        </div>
    )
}
