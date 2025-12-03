import '../../styles/ActivityDetailStyle.css'
import type { ActivityOccurrence } from '../../types/activityOccurrence';
import { FiBellOff, FiArrowLeft } from "react-icons/fi"
import { useEffect } from "react";
import BadmintonImage from '../../assets/Badminton.jpg';
import FootballImage from '../../assets/Football.jpg';
import SwimmingImage from '../../assets/Swimming.jpg';

type Props = {
  activity: ActivityOccurrence;
  open: boolean;
  onClose: () => void;
};

export default function DialogBox({ activity, open, onClose }: Props) {

useEffect(() => {
  if (open) {
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  } else {
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }
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

          {activity.description && (
            <div className="detail-section">
                <h3 className="detail-section-title">Beskrivelse:</h3>

                <div className="detail-description-box">
                    <p className="detail-description">{activity.description}</p>
                </div>
            </div>
          )}



        <p className="activity-detail-instructor">
        <strong>Instruktør:</strong>
        </p>

        {/* Hvis der er instruktører */}
        {activity.instructors && activity.instructors.length > 0 ? (
        <div className="detail-instructor-card">
            {activity.instructors.map((inst) => (
            <div className="detail-instructor-item" key={inst.id}>
                
                <div className="detail-instructor-image-wrap">
                <img
                    src={inst.image ? inst.image : "/assets/instructors/placeholder.png"}
                    alt={inst.firstName}
                />
                </div>

                <div className="detail-instructor-info">
                <div className="detail-instructor-name">{inst.firstName}</div>

                {inst.number && (
                    <div className="detail-instructor-contact">{inst.number}</div>
                )}

                {inst.email && (
                    <div className="detail-instructor-contact">{inst.email}</div>
                )}
                </div>

            </div>
            ))}
        </div>
        ) : (
        <p className="detail-instructor-none">Ikke angivet</p>
        )}

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
