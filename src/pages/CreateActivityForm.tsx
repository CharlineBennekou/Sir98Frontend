import { useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useCreateActivityMutation } from "../store/apis/activityAPI";
import { useFetchInstructorsQuery } from "../store/apis/instructorAPI";

export default function CreateActivityForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");

  const [createActivity, { isLoading, isSuccess, isError }] =
    useCreateActivityMutation();

  const { data: instructors = [], isLoading: instructorsLoading } =
    useFetchInstructorsQuery();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!instructor) {
      alert("Du skal vælge en instruktør!");
      return;
    }

    const startUtc = new Date(start).toISOString();
    const endUtc = new Date(end).toISOString();

    // Find den valgte instruktør fra liste
    const selectedInstructor = instructors.find(
      (inst) => inst.id === Number(instructor)
    );

    if (!selectedInstructor) {
      alert("Instruktør ikke fundet!");
      return;
    }

    const newActivity = {
      title,
      startUtc,
      endUtc,
      address: location,
      description: description || "",
      image: "",        // Backend kræver string
      link: undefined,  // optional
      cancelled: false,
      instructors: [
        {
          id: selectedInstructor.id,
          firstName: selectedInstructor.firstName,
          email: selectedInstructor.email ?? null,
          number: selectedInstructor.number ?? null,
          image: selectedInstructor.image ?? null,
        },
      ],
      tags: [type],
      isRecurring: false,
      rrule: undefined,
    };

    console.log("SENDER TIL BACKEND:", newActivity);

    try {
      await createActivity(newActivity).unwrap();
      alert("Aktivitet oprettet!");

      // Reset form
      setTitle("");
      setType("training");
      setStart("");
      setEnd("");
      setLocation("");
      setInstructor("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Fejl ved oprettelse af aktivitet!");
    }
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
             <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="training">Træning</option>
              <option value="events">Begivenhed</option>
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
            {instructorsLoading ? (
              <p>Henter instruktører…</p>
            ) : (
              <select
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                required
              >
                <option value="">Vælg instruktør</option>
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.firstName}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label>
            Beskrivelse
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Opretter..." : "Opret Aktivitet"}
          </button>

          {isSuccess && <p style={{ color: "green" }}>Aktivitet oprettet!</p>}
          {isError && <p style={{ color: "red" }}>Der opstod en fejl.</p>}
        </form>
      </div>
    </>
  );
}
