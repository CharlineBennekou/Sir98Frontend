import '../../styles/NewActivityCardStyle.css'
import type { Activity } from '../../types/activity'
import { FiUser, FiMapPin, FiClock, FiBellOff } from "react-icons/fi";
import ActivityDetail from './ActivityDetail';
import { useState } from "react";
import BadmintonImage from '../../assets/badminton.jpg';
import FootballImage from '../../assets/football.jpg';
import SwimmingImage from '../../assets/swimming.jpg'; 

type Props = {
    activity: Activity
    subscribed: boolean
    onViewDetails?: (activity: Activity) => void
}

export default function ActivityCard({ activity, subscribed }: Props) {

    const startTime = activity.start ? new Date(activity.start) : null;
    const endTime = activity.end ? new Date(activity.end) : null;
    const [dialogOpen, setDialogOpen] = useState(false);

    const activityImages: Record<string, string> = {
        Badminton: BadmintonImage,
        Fodbold: FootballImage,
        Svømning: SwimmingImage
    };

    const instructorName =
        activity.instructors?.length
            ? activity.instructors.map((i) => i.firstName).join(" & ")
            : "Ikke angivet";

    return (
        <>
            <div 
                className={`activity-card ${activity.cancelled ? "cancelled-card" : ""} ${subscribed ? 'subscribed' : ''}`}
                onClick={() => setDialogOpen(true)}
            >
                {/* AFLYST badge – kun hvis aflyst */}
                {activity.cancelled && (
                    <div className="cancelled-banner">
                        AFLYST
                    </div>
                )}

                {/* Billede + klokke ikon */}
                {activityImages[activity.title] && (
                    <div className="activity-image-wrapper">
                        <div
                            className="activity-image"
                            style={{ backgroundImage: `url(${activityImages[activity.title]})` }}
                        />

                        {/* 🔔 klokke ikon */}
                        <button
                            className="bell-button"
                            onClick={(e) => {
                                e.stopPropagation();  // Stopper klik fra at åbne dialog
                                console.log("Bell clicked!");
                            }}
                        >
                            <FiBellOff />
                        </button>
                    </div>
                )}

                <div className="activity-body">

                    <h3 className="activity-title">{activity.title}</h3>

                    <p className="activity-instructor">
                        <FiUser className="icon" /> {instructorName}
                    </p>

                    {activity.address && (
                        <p className="activity-location">
                            <FiMapPin className="icon" />
                            {activity.address}
                        </p>
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

                </div>
            </div>

            <ActivityDetail
                activity={activity}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </>
    );
}
