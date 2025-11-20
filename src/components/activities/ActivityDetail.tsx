import '../../styles/ActivityDetailStyle.css'
import type { Activity } from "../../types/activity";
import BadmintonImage from '../../assets/badminton.jpg';
import FootballImage from '../../assets/football.jpg';
import SwimmingImage from '../../assets/swimming.jpg'; 

type Props = {
  activity: Activity;
  open: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
  subscribed: boolean;
};

export default function DialogBox({ activity, open, onClose, onToggle, subscribed }: Props) {
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
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Titel */}
        <h2>{activity.title}</h2>

       
      {activityImages[activity.title] && (
  <div
    className="activity-image"
    style={{ backgroundImage: `url(${activityImages[activity.title]})` }}
  />
)}


        {/* Instruktør */}
        <p>
          <strong>Instruktør:</strong>{" "}
          {activity.instructors?.[0]?.firstName ?? "Ikke angivet"}
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

        {/* Cancelled badge */}
        {activity.cancelled && (
          <div className="dialog-cancelled">AFLYST</div>
        )}

        {/* Knapper */}
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
        </div>
      </div>
    </div>
  );
}
