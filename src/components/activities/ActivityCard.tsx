import '../../styles/NewActivityCardStyle.css'
import type { ActivityOccurrence } from '../../types/activityOccurrence';
import { FiUser, FiMapPin, FiClock, FiBellOff, FiBell } from "react-icons/fi";
import ActivityDetail from './ActivityDetail';
import React, { useState } from "react"; // 👈 add React if you use React.MouseEvent
import { toast } from 'react-hot-toast';
import BadmintonImage from '../../assets/Badminton.jpg';
import FootballImage from '../../assets/Football.jpg';
import SwimmingImage from '../../assets/Swimming.jpg'; 
import CirkeltrainingImage from '../../assets/Cirkeltræning.jpg';
import { useSubscribeToOccurrence, useUnsubscribeFromOccurrence } from '../../store/apis/api';

type Props = {
    activity: ActivityOccurrence
    onViewDetails?: (activity: ActivityOccurrence) => void
}

export default function ActivityCard({ activity }: Props) {
    //Hooks
    const [dialogOpen, setDialogOpen] = useState(false);
    const [subscribeToOccurrence, { isLoading: isSubscribing }] = useSubscribeToOccurrence();
    const [unsubscribeFromOccurrence, { isLoading: isUnsubscribing }] = useUnsubscribeFromOccurrence();


    //Constants
    const isLoading = isSubscribing || isUnsubscribing;
    const userId = "userId";

    const activityImages: Record<string, string> = {
        Badminton: BadmintonImage,
        Fodbold: FootballImage,
        Svømning: SwimmingImage,
        Cirkeltræning: CirkeltrainingImage
    };


    async function handleBellClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation(); // prevent opening the detail dialog
        const payload = { //types/activitysubscription.ts
            userId,
            activityId: activity.id,             
            originalStartUtc: activity.originalStartUtc,
        };

        try {
            if (activity.isSubscribed) { 
                toast.success(`Afmeldt ${activity.title}`, {
                iconTheme: {
                primary: "#ff9800",     // orange circle
                secondary: "#fff",      // white background
                },
});

                console.log("Unsubscribing from activity:", payload);
                await unsubscribeFromOccurrence(payload); // DELETE
            } else {
                toast.success(`Tilmeldt ${activity.title}`);
                console.log("Subscribing to activity:", payload);
                await subscribeToOccurrence(payload);     // POST
            }
        } catch (err) {
            console.error("Fejl ved subscription:", err);
            toast.error("Noget gik galt. Prøv igen.");
        }
    }

    //Derived values
        const startTime = activity.startUtc ? new Date(activity.startUtc) : null;
        const endTime = activity.endUtc ? new Date(activity.endUtc) : null;

        const imageUrl = activityImages[activity.title];

        const instructorName =
        activity.instructors?.length
            ? activity.instructors.map((i) => i.firstName).join(" & ")
            : "Ikke angivet";



    return (
        <>
            <div 
                className={`activity-card ${activity.cancelled ? "cancelled-card" : ""} ${activity.isSubscribed ? 'subscribed' : ''}`}
                onClick={() => setDialogOpen(true)}
            >
                {activity.cancelled && (
                    <div className="cancelled-banner">
                        AFLYST
                    </div>
                )}

                {imageUrl && (
                    <div className="activity-image-wrapper">
                        <div
                            className="activity-image"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />

                        <h3 className="activity-title-overlay">{activity.title}</h3>

                        <button
                            className="bell-button"
                            onClick={handleBellClick}
                            disabled={isLoading}
                        >
                            {activity.isSubscribed ? <FiBellOff /> : <FiBell />}
                        </button>
                    </div>
                )}

                <div className="activity-body">
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
  ? startTime.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Copenhagen'
    })
  : ""}
{endTime
  ? ` - ${endTime.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Copenhagen'
    })}`
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
