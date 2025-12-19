import type { Instructor } from '../../types/instructors';
import { Link } from "react-router-dom";
import { useDeleteInstructorMutation } from "../../store/apis/api";
import "../../styles/InstructorListStyle.css";
import hans from "../../assets/instructors/hansBillede.png";
import liselotte from "../../assets/instructors/LiselotteBillede.png";
import jeppe from "../../assets/instructors/JeppeBillede.png";

type Props = {
    instructor: Instructor;
};

export const instructorImages: Record<string, string> = {
    "hansBillede.png": hans,
    "LiselotteBillede.png": liselotte,
    "JeppeBillede.png": jeppe,
};

export default function InstructorCard({ instructor }: Props) {
    const [deleteInstructor, { isLoading: isDeleting }] = useDeleteInstructorMutation();

    const handleDelete = async () => {
        const confirmed = window.confirm(`Er du sikker på, at du vil slette ${instructor.firstName}?`);
        if (!confirmed) return;

        try {
            await deleteInstructor(instructor.id).unwrap();
            alert("Instruktør slettet!");
            // RTK Query vil automatisk opdatere listen, hvis du bruger useFetchInstructorsQuery
        } catch (err) {
            console.error(err);
            alert("Fejl ved sletning af instruktør");
        }
    };

    const imageUrl = instructor.image ?? "/assets/instructors/placeholder.png";

    return (
        <div className="instructor-card">
            <div className="instructor-image-wrap">
                <img
                    className="instructor-image"
                    src={imageUrl}
                    alt={instructor.image ? `Billede af ${instructor.firstName}` : "Pladsholderbillede for instruktør"}
                />
            </div>

            <div className="instructor-info">
                <div className="instructor-name">
                    <div className="contact-line">
                        <span data-testid="instructor-name-value">
                            {instructor.firstName ?? <span style={{ color: "#c00" }}>Navn ikke fundet</span>}
                        </span>
                    </div>

                    <div className="instructor-contact">
                        <div className="contact-line">
                            <span className="contact-label">Telefon:</span>
                            {instructor.number ? (
                                <a href={`tel:${instructor.number}`} className="contact-phone">
                                    {instructor.number}
                                </a>
                            ) : (
                                <span style={{ flexBasis: "100%" }}></span>
                            )}
                        </div>

                        <div className="contact-line">
                            <span className="contact-label">Mail:</span>
                            {instructor.email ? (
                                <a href={`mailto:${instructor.email}`} className="contact-email">
                                    {instructor.email}
                                </a>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---------- Opdater og Slet knapper ---------- */}
                {
                    (localStorage.getItem("Role") === "Instructor") ? 
                    <div className="instructor-card-buttons">
                        <Link
                            to={`/update-instructor/${instructor.id}`}
                            className="instructor-btn update-btn"
                        >
                            Opdater
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="instructor-btn delete-btn"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Sletter..." : "Slet"}
                        </button>
                    </div>
                    :
                    null
                }
                
            </div>
        </div>
    );
}
