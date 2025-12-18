import InstructorCard from '../components/instructors/InstructorCard';
import { useFetchInstructorsQuery } from "../store/apis/api";
import type { Instructor } from '../types/instructors';
import "./../styles/InstructorListStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { Link } from 'react-router-dom';
import { LuSquarePlus } from "react-icons/lu";



export default function InstructorList() {
    const { data: instructors = [], isLoading, isError } = useFetchInstructorsQuery();

   

    if (isLoading) return <p>Henter instruktører…</p>;
    if (isError) return <p>Kunne ikke hente instruktører.</p>;

    return (
        <>
        <AppHeader title="Instruktører" />
        

        <div className="instructor-list-page">

            <div className="instructor-list-header">
                <Link to="/create-instructor" className="create-instructor-btn">
                    <span className="icon-wrapper-add"><LuSquarePlus /></span>
                    Opret instruktør
                </Link>
            </div>
        
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
