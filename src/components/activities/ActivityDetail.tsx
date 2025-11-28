import '../../styles/ActivityDetailStyle.css'
import type { Activity } from "../../types/activity";
import { FiBellOff, FiArrowLeft } from "react-icons/fi"
import { useEffect } from "react";
import BadmintonImage from '../../assets/badminton.jpg';
import FootballImage from '../../assets/football.jpg';
import SwimmingImage from '../../assets/swimming.jpg';

type Props = {
  activity: Activity;
  open: boolean;
  onClose: () => void;
};

export default function DialogBox({ activity, open, onClose }: Props) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

  if (!open) return null;

  const start = activity.startUtc ? new Date(activity.startUtc) : null;
  const end = activity.endUtc ? new Date(activity.endUtc) : null;

  const activityImages: Record<string, string> = {
    Badminton: BadmintonImage,
    Fodbold: FootballImage,
    Svømning: SwimmingImage
  };

  const imageUrl = activityImages[activity.title];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className={`dialog-content ${activity.cancelled ? "cancelled-detail-card" : ""}`} 
        onClick={(e) => e.stopPropagation()}>

        {/* Tilbage-pil */}
        <button className="dialog-back-button" onClick={onClose}>
          <FiArrowLeft />
        </button>

        <div className="dialog-body">

          <h2 className="detail-title">{activity.title}</h2>

          {imageUrl && (
            <div className="dialog-image-wrapper">
              <div
                className="dialog-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />

              {activity.cancelled && (
                <div className="image-cancelled-overlay">AFLYST</div>
                )}

              {/* 🔔 klokke ikon */}
              <button
                className="bell-button"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Bell icon clicked in dialog for activity:", activity.id);
                  // Her kan du f.eks. toggles notifikation eller lign.
                }}
              >
                <FiBellOff />
              </button>
            </div>
          )}

          {/* Resten af detaljer */}
          <p className="activity-detail-instructor">
            <strong>Instruktør:</strong>{" "}
            {activity.instructors && activity.instructors.length > 0
              ? activity.instructors.map((i) => i.firstName).join(" & ")
              : "Ikke angivet"}
          </p>

          {activity.address && (
            <p>
              <strong>Adresse:</strong> {activity.address}
            </p>
          )}

          <p>
            <strong>Tidspunkt:</strong>{" "}
            {start ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
            {end ? ` - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
          </p>

          {activity.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a href={activity.link} target="_blank" rel="noopener noreferrer">
                Åbn ekstern side →
              </a>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
