import '../../styles/ActivityDetailStyle.css'
import type { Activity } from "../../types/activity";
import BadmintonImage from '../../assets/badminton.jpg';
import FootballImage from '../../assets/football.jpg';
import SwimmingImage from '../../assets/swimming.jpg'; 

type Props = {
  activity: Activity;
  open: boolean;
  onClose: () => void;
};

export default function DialogBox({ activity, open, onClose }: Props) {
  if (!open) return null;

  const start = activity.start ? new Date(activity.start) : null;
  const end = activity.end ? new Date(activity.end) : null;

      const activityImages: Record<string, string> = 
    {
        Badminton: BadmintonImage,
        Fodbold: FootballImage,
        Svømning: SwimmingImage
    };

  return (
    
    <div className={`dialog-overlay ${activity.cancelled ? "cancelled-detail-card" : ""}`} onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        
              {/* AFLYST badge – kun hvis aflyst */}
      {activity.cancelled && (
        <div className="cancelled-detail-banner">
          AFLYST
        </div>
      )}

<div className="dialog-body">

        {/* Titel */}
        <h2 className='detail-title'>{activity.title}</h2>

       
      {activityImages[activity.title] && (
  <div
    className="dialog-image"
    style={{ backgroundImage: `url(${activityImages[activity.title]})` }}
  />
)}


        {/* Instruktør */}
        <p className="activity-detail-instructor">
          <strong>Instruktør:</strong>{" "}
          {activity.instructors && activity.instructors.length > 0
            ? activity.instructors.map((i) => i.firstName).join(" & ")
            : "Ikke angivet"}
        </p>

        {/* Adresse */}
        {activity.address && (
          <p>
            <strong>Adresse:</strong> {activity.address}
          </p>
        )}

        {/* Tidspunkt */}
        <p>
          <strong>Tidspunkt:</strong>{" "}
          {start ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
          {end ? ` - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
        </p>

        {/* Link hvis der findes */}
        {activity.link && (
          <p>
            <strong>Link:</strong>{" "}
            <a href={activity.link} target="_blank" rel="noopener noreferrer">
              Åbn ekstern side →
            </a>
          </p>
        )}



        {/* Knapper
        <div className="dialog-actions">
          <button
            className={`subscribe-btn-dialog ${subscribed ? "active" : ""}`}
            onClick={() => onToggle(activity.id.toString())}
          >
            {subscribed ? "Tilmeldt" : "Tilmeld dig"}
          </button>

          <button className="close-btn-dialog" onClick={onClose}>
            Luk
          </button>
        </div> */}
      </div>
        </div>
    </div>
  );
}
