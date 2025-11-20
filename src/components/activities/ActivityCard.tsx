import '../../styles/NewActivityCardStyle.css'
import type { Activity } from '../../types/activity'
import { FiUser, FiMapPin, FiClock } from "react-icons/fi"
import ActivityDetail from './ActivityDetail';
import { useState } from "react";
import BadmintonImage from '../../assets/badminton.jpg';
import FootballImage from '../../assets/football.jpg';
import SwimmingImage from '../../assets/swimming.jpg'; 

type Props = {
    activity: Activity
    subscribed: boolean
    onToggle: (id: string) => void
    onViewDetails?: (activity: Activity) => void
}

export default function ActivityCard({ activity, subscribed, onToggle }: Props) {

    const startTime = activity.start ? new Date(activity.start) : null;
    const endTime = activity.end ? new Date(activity.end) : null;
    const [dialogOpen, setDialogOpen] = useState(false);

    const activityImages: Record<string, string> = 
    {
        Badminton: BadmintonImage,
        Fodbold: FootballImage,
        Svømning: SwimmingImage
    };

    const instructorName =
        activity.instructors?.length
            ? activity.instructors[0]?.firstName
            : "Uden instruktør";

    return (
        <>
        <div className={`activity-card ${activity.cancelled ? 'cancelled' : ''} ${subscribed ? 'subscribed' : ''}`}>
            
            {activityImages[activity.title] && (
    <div
        className="activity-image"
        style={{ backgroundImage: `url(${activityImages[activity.title]})` }}
    />
)}

            <div className="activity-body">

                <h3 className="activity-title">{activity.title}</h3>

                <p className="activity-instructor">
                    <FiUser className="icon"
                    /> {instructorName}</p>

                {activity.address && (
                    <p className="activity-location">
                        <FiMapPin className="icon" /> 
                        {activity.address}</p>
                )}

                <div className="activity-time">
                    <FiClock className="icon" />
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
                        onClick={() => setDialogOpen(true)}
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
                    <ActivityDetail
                activity={activity}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onToggle={onToggle}
                subscribed={subscribed}
            />
        </>
    );
}
