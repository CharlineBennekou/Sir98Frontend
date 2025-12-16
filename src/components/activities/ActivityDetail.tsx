import "../../styles/ActivityDetailStyle.css";
import type { ActivityOccurrence } from "../../types/activityOccurrence";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect } from "react";
import DefaultImage from "../../assets/placeHolderGreyPic.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteActivityMutation } from "../../store/apis/activityAPI";

type Props = {
  activity: ActivityOccurrence;
  open: boolean;
  onClose: () => void;
};

export default function DialogBox({ activity, open, onClose }: Props) {
  /* ---------- Hooks SKAL ligge øverst ---------- */
  const navigate = useNavigate();

  const [deleteActivity, { isLoading: isDeleting }] =
    useDeleteActivityMutation();

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

  /* ---------- Data ---------- */
  const start = activity.startUtc ? new Date(activity.startUtc) : null;
  const end = activity.endUtc ? new Date(activity.endUtc) : null;

  const imageUrl = activity.image?.trim() ? activity.image : DefaultImage;

  /* ---------- Delete handler ---------- */
  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Er du sikker på, at du vil slette denne aktivitet?"
    );

    if (!confirmDelete) return;

    try {
      await deleteActivity(activity.id).unwrap();
      onClose();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Kunne ikke slette aktiviteten");
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog-content ${
          activity.cancelled ? "cancelled-detail-card" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Tilbage ---------- */}
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
            </div>
          )}

          {/* ---------- Handlinger ---------- */}
          <div className="activity-detail-actions">
            <Link
              to={`/update-activity/${activity.id}`}
              className="submit-btn"
              onClick={onClose}
            >
              Opdater aktivitet
            </Link>

            <button
              onClick={handleDelete}
              className="submit-btn delete-btn"
              disabled={isDeleting}
            >
              {isDeleting ? "Sletter..." : "Slet aktivitet"}
            </button>
          </div>

          {activity.address && (
            <p>
              <strong>Adresse:</strong> {activity.address}
            </p>
          )}

          <p>
            <strong>Tidspunkt:</strong>{" "}
            {start ? start.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' }) : ""}
            {end ? ` - ${end.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen' })}` : ""}
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

          {activity.instructors && activity.instructors.length > 0 ? (
            <div className="detail-instructor-card">
              {activity.instructors.map((inst) => (
                <div className="detail-instructor-item" key={inst.id}>
                  <div className="detail-instructor-image-wrap">
                    <img
                      src={
                        inst.image ??
                        "/assets/instructors/placeholder.png"
                      }
                      alt={inst.firstName}
                    />
                  </div>

                  <div className="detail-instructor-info">
                    <div className="detail-instructor-name">
                      {inst.firstName}
                    </div>

                    {inst.number && (
                      <div className="detail-instructor-contact">
                        {inst.number}
                      </div>
                    )}

                    {inst.email && (
                      <div className="detail-instructor-contact">
                        {inst.email}
                      </div>
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
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Åbn ekstern side →
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
