import { useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useCreateActivityMutation } from "../store/apis/activityAPI";
import { useFetchInstructorsQuery } from "../store/apis/instructorAPI";
import { FiX } from "react-icons/fi";

export default function CreateActivityForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([""]);

  const [createActivity, { isLoading, isSuccess, isError }] =
    useCreateActivityMutation();

  const { data: instructors = [], isLoading: instructorsLoading } =
    useFetchInstructorsQuery();

  function updateInstructor(index: number, value: string) {
    const newList = [...selectedInstructors];
    newList[index] = value;
    setSelectedInstructors(newList);
  }

  function addInstructor() {
    setSelectedInstructors((prev) => [...prev, ""]);
  }

  function removeInstructor(index: number) {
    setSelectedInstructors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const startUtc = new Date(start).toISOString();
    const endUtc = new Date(end).toISOString();

    // Lav liste af instruktør-objekter
    const instructorObjects = selectedInstructors
      .filter((id) => id !== "") // fjern tomme valg
      .map((id) => instructors.find((inst) => inst.id === Number(id)))
      .filter(Boolean)
      .map((inst) => ({
        id: inst!.id,
        firstName: inst!.firstName,
        email: inst!.email ?? null,
        number: inst!.number ?? null,
        image: inst!.image ?? null,
      }));

    const newActivity = {
      title,
      startUtc,
      endUtc,
      address: location,
      description: description || "",
      image: "",
      link: link || "",
      cancelled: false,
      instructors: instructorObjects,
      tags: [type],
      isRecurring,
      rrule: isRecurring ? `FREQ=WEEKLY` : undefined,
    };

    console.log("SENDER:", newActivity);

    try {
      await createActivity(newActivity).unwrap();
      alert("Aktivitet oprettet!");

      // Reset
      setTitle("");
      setType("training");
      setStart("");
      setEnd("");
      setLocation("");
      setSelectedInstructors([""]);
      setDescription("");
      setLink("");
    } catch (err) {
      console.error(err);
      alert("Fejl ved oprettelse af aktivitet!");
    }
  }

  function availableOptions(currentIndex: number) {
    const usedIds = selectedInstructors.filter((id, i) => id !== "" && i !== currentIndex);
    return instructors.filter((inst) => !usedIds.includes(String(inst.id)));
  }

  return (
    <>
      <AppHeader title="Opret Ny Aktivitet" />
      <div style={{ marginTop: 70 }}></div>

      <div className="create-activity-container">
        <h2>Opret Ny Aktivitet</h2>

        <form className="create-activity-form" onSubmit={handleSubmit}>
          {/* Almindelige felter */}
          <label>
            Titel
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          </label>

          <label>
            Slut tidspunkt
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "22px",
              marginTop: "10px",
              cursor: "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ transform: "scale(1.2)" }} // gør den lidt pænere & tydeligere
            />

            <span>Aktiviteten gentages hver uge</span>
          </label>  

          <label>
            Lokation
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          {/* ⭐ Instruktør-sektion */}
          <label>
            Instruktører
            {selectedInstructors.map((value, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 8,
                  width: "100%",
                }}
              >

                {instructorsLoading ? (
                  <p>Henter...</p>
                ) : (
                <select
                  value={value}
                  onChange={(e) => updateInstructor(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    minWidth: "260px",
                  }}
                >
                    <option value="">Vælg instruktør</option>
                    {availableOptions(index).map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName}
                      </option>
                    ))}
                  </select>
                )}

                {/* Fjern-knap (vises kun hvis mere end 1 dropdown) */}
                {selectedInstructors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstructor(index)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiX
                    size={18}
                    color="#777"
                    style={{ transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d9534f")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}
                  />
                </button>

                )}
              </div>
            ))}

            {/* ⭐ Plus ikon */}
            <button
              type="button"
              onClick={addInstructor}
              style={{
                marginTop: 5,
                background: "#898c8eff",
                color: "white",
                padding: "4px 8px",
                borderRadius: 5,
                border: "none",
                cursor: "pointer"
              }}
            >
              + Tilføj instruktør
            </button>
          </label>

          <label>
            Beskrivelse
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>
            Link
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
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
