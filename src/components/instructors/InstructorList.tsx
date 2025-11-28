import InstructorCard from './InstructorCard';
import { useFetchInstructorsQuery } from "../../store/apis/instructorAPI";
import type { Instructor } from '../../types/instructors';
import "../../styles/InstructorListStyle.css";
import AppHeader from "../layout/AppHeader";


export default function InstructorList() {
    const { data: instructors = [], isLoading, isError } = useFetchInstructorsQuery();

   

    if (isLoading) return <p>Henter instruktører…</p>;
    if (isError) return <p>Kunne ikke hente instruktører.</p>;

    return (
        <>
        <AppHeader title="Instruktører" />
            <div style={{ marginTop: 70 }}></div>

        <div className="instructor-list-page">
            <h2>Instruktører</h2>
            <div className="instructor-list">
                {instructors.map((ins: Instructor) => (
                    <div className = "instructor-list-item" key={ins.id}>
                        <InstructorCard
                            instructor={ins}
                        />
                    </div>
                ))}
            </div>
        </div>
      </>
    );
}
