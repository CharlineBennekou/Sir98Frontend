import '../../styles/NewActivityCardStyle.css'
import type { ActivityOccurrence } from '../../types/activityOccurrence';
import { FiUser, FiMapPin, FiClock, FiChevronDown } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import ActivityDetail from './ActivityDetail';
import { useState } from "react";
import { toast } from 'react-hot-toast';
import DefaultImage from '../../assets/placeHolderGreyPic.jpg';
import DropUpMenu from './DropUpMenu';

import { isAuthenticated } from '../users/IsAuthenticated';
import { useSubscribeToOccurrence, useUnsubscribeFromOccurrence } from '../../store/apis/api';
import { useNavigate } from "react-router-dom";

type Props = {
    activity: ActivityOccurrence
    onViewDetails?: (activity: ActivityOccurrence) => void
}

export default function ActivityCard({ activity }: Props) {
    // Hooks
    const [menuOpen, setMenuOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [subscribeToOccurrence, { isLoading: isSubscribing }] = useSubscribeToOccurrence();
    const [unsubscribeFromOccurrence, { isLoading: isUnsubscribing }] = useUnsubscribeFromOccurrence();

    // Constants
    const isLoading = isSubscribing || isUnsubscribing;
    const navigate = useNavigate();
    const userId = String(localStorage.getItem("Email"));

    

    // use default if no specific image
    const imageUrl = activity.image?.trim() ? activity.image : DefaultImage;
    console.log("Activity image URL:", imageUrl);

    async function SingleOccurrencePayload(){
       await  PostSubscription(false);
    }
    async function AllOccurrencesPayload(){
       await  PostSubscription(true);
    }


    async function PostSubscription(all: boolean)
    {
        try {
            if (activity.isSubscribed) { 
                toast.success(`Afmeldt ${activity.title}`,
                    {
                    iconTheme: {
                        primary: "#ff9800",     // orange circle
                        secondary: "#fff",      // white background
                    },
                });
                const Deletepayload = { //types/activitysubscription.ts // ActivitySubscriptionDeleteDTO
                   userId: String(userId),
                    activityId: activity.id,
                    originalStartUtc: activity.originalStartUtc,
                };
                console.log("Unsubscribing from activity:", Deletepayload);
                await unsubscribeFromOccurrence(Deletepayload); // DELETE
            } 
            else {
                const Postpayload = { //types/activitysubscription.ts // ActivitySubscriptionPostDTO
                    userId: String(userId),
                    activityId: activity.id,
                    originalStartUtc: activity.originalStartUtc,
                    AllOccurrences: all,
                };
                toast.success(`Tilmeldt ${activity.title}`);
                console.log("Subscribing to activity:", Postpayload);
                await subscribeToOccurrence(Postpayload);     // POST
            }
        } catch (err) {
            console.error("Fejl ved subscription:", err);
            toast.error("Noget gik galt. Prøv igen.");
        }
    }

    // Derived values
    const startTime = activity.startUtc ? new Date(activity.startUtc) : null;
    const endTime = activity.endUtc ? new Date(activity.endUtc) : null;

    const instructorName =
        activity.instructors?.length
            ? activity.instructors.map((i) => i.firstName).join(" & ")
            : "Ingen instruktør";
    
    return (
        <>
            <div 
                className={`activity-card ${activity.cancelled ? "cancelled-card" : ""} ${activity.isSubscribed ? 'subscribed' : ''}`}
            >
                {activity.cancelled && (
                    <div className="cancelled-banner">
                        AFLYST
                    </div>
                )}

                {/* Billede */}
                {imageUrl && (
                    <div className="activity-image-wrapper">
                        <div
                            className="activity-image"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />

                        <h3 className="activity-title-overlay">{activity.title}</h3>
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
                    <div className="activity-date">
                        <LuCalendarDays className="icon" />
                        {startTime
                            ? startTime.toLocaleDateString('da-DK', {
                                day: 'numeric',
                                month: 'long',
                                timeZone: 'Europe/Copenhagen'
                            })
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
                                className={`follow-btn ${activity.isSubscribed ? "subscribed" : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (!isAuthenticated()) { //if no token go to login page
                                        alert("Du skal være logget ind for at følge aktiviteter.");
                                        navigate("/login");
                                        
                                        return;
                                }

                                    setMenuOpen(true);
                                }}
                                    disabled={isLoading}   //gør knappen inaktiv under loading
                                >
                                    {isLoading ? "Opdaterer..." : activity.isSubscribed ? "Følger" : "Følg"} <FiChevronDown />
                            </button>
                        </div>
                </div>
            </div>

            <ActivityDetail
                activity={activity}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />

           <DropUpMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                onFollowSingle={async () => {
                    await SingleOccurrencePayload();
                }}
                onFollowAll={async () => {
                    await AllOccurrencesPayload();
                }}
                onUnfollow={async () => {
                    if (activity.isSubscribed) {
                        try {
                            await unsubscribeFromOccurrence({
                                userId,
                                activityId: activity.id,
                                originalStartUtc: activity.originalStartUtc
                            });
                            toast.success(`Afmeldt ${activity.title}`, {
                                iconTheme: {
                                    primary: "#ff9800",
                                    secondary: "#fff",
                                },
                            });
                        } catch (err) {
                            console.error("Fejl ved unsubscribe:", err);
                            toast.error("Noget gik galt. Prøv igen.");
                        }
                    }
                }}
                isSubscribed={activity.isSubscribed}
                activityTitle={activity.title}
            />
        </>
    );
}
