import { useState } from "react";
import "../../styles/CreateActivityFormStyle.css";
import AppHeader from "../layout/AppHeader";


export default function CreateActivityForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newActivity = {
      title,
      type,
      start,
      end,
      address: location,
      instructors: instructor ? [{ firstName: instructor }] : [],
      description
    };

    console.log("NY AKTIVITET:", newActivity);

    alert("Aktivitet oprettet! (Mock – backend mangler)");
  }

  return (
    <>
    <AppHeader title="Opret Ny Aktivitet" />
        <div style={{ marginTop: 70 }}></div>
    <div className="create-activity-container">
      <h2>Opret Ny Aktivitet</h2>

      <form className="create-activity-form" onSubmit={handleSubmit}>

        <label>
          Titel
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Type
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="training">Træning</option>
            <option value="event">Begivenhed</option>
          </select>
        </label>

        <label>
          Start tidspunkt
          <input 
            type="datetime-local" 
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </label>

        <label>
          Slut tidspunkt
          <input 
            type="datetime-local" 
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>

        <label>
          Lokation
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label>
          Instruktør
          <input 
            type="text" 
            placeholder="Navn (fx. Peter)"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </label>

        <label>
          Beskrivelse
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit" className="submit-btn">
          Opret Aktivitet
        </button>
      </form>
    </div>
    </>
  );
}
