// import Link from 'next/link';
import type { Instructor } from '../../types/instructors';
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

    console.log ("INSTRUCTOR OBJECT:", instructor);


 const imageUrl = instructor.image && instructorImages[instructor.image]
    ? instructorImages[instructor.image]
    : "/assets/instructors/placeholder.png";




    return (
        
            <div className="instructor-card">
            <div className = "instructor-image-wrap">
                <img className ="instructor-image"
                  src = {imageUrl} 
                  alt={instructor.image ? `Billede af ${instructor.firstName}` : "Pladsholderbillede for instruktør"}
                //      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 
                //     "/assets/instructors/placeholder.png"; 
                //  }}
                />
            </div>

            <div className="instructor-info">
                <div className = "instructor-role">
                    {instructor.role ?? "Instruktør"}
                </div>


                <div className = "instructor-name">
                    <div className = "contact-line">
                        
                        {/* <span>{instructor.firstName ?? ""}</span> */}
                        <span data-testid="instructor-name-value">
                          {instructor.firstName ?? <span style={{ color: "#c00" }}>Navn ikke fundet</span>}
                        </span>

                     </div>


                <div className = "instructor-contact">
                    <div className = "contact-line">
                        <span className="contact-label">Telefon:</span>
                        <span>{instructor.number ?? ""}</span>
                      </div>

                        <div className = "contact-line">
                        <span className="contact-label">Mail:</span>
                        <span>{instructor.email ?? ""}</span>
                        </div>
                </div>


            </div>
         </div>

         
     
    </div>
    

    



    );



}
