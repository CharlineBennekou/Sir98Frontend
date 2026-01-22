import { useState, useEffect } from "react";
import "../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { FiX } from "react-icons/fi";
import { useFetchInstructorsQuery, useUpsertOccurrenceMutation } from "../store/apis/api";
import { utcIsoToDkDateTimeLocal, dkDateTimeLocalToUtcIso } from "../utils/dateTimeService";


import type { EditOccurrenceDto } from "../types/newEditOccurrenceDTO";
import type { ActivityOccurrence } from "../types/activityOccurrence";

interface EditOccurrenceProps {
  activity: ActivityOccurrence;
  onSaved?: () => void;
}

export default function EditOccurrence({ activity, onSaved }: EditOccurrenceProps) {
  const { data: instructors = [], isLoading: instructorsLoading } =
    useFetchInstructorsQuery();

  const [upsertOccurrence, { isLoading }] =
    useUpsertOccurrenceMutation();

  /* ---------- State (samme logik som før) ---------- */
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([""]);

  /* ---------- Prefill ---------- */
  useEffect(() => {
    console.log("Prefilling form with activity:", activity);
    setTitle(activity.title);
    setType(activity.tag ?? "training");
    setStart(utcIsoToDkDateTimeLocal(activity.startUtc));
    setEnd(utcIsoToDkDateTimeLocal(activity.endUtc));
    setLocation(activity.address ?? "");
    setDescription(activity.description ?? "");
    setCancelled(activity.cancelled);

    setSelectedInstructors(
      activity.instructors.length > 0
        ? activity.instructors.map(i => String(i.id))
        : [""]
    );
  }, [activity]);

  /* ---------- Instructor helpers ---------- */
  function updateInstructor(index: number, value: string) {
    const list = [...selectedInstructors];
    list[index] = value;
    setSelectedInstructors(list);
  }

  function addInstructor() {
    setSelectedInstructors(prev => [...prev, ""]);
  }

  function removeInstructor(index: number) {
    setSelectedInstructors(prev => prev.filter((_, i) => i !== index));
  }

  function availableOptions(currentIndex: number) {
    const usedIds = selectedInstructors.filter(
      (id, i) => id !== "" && i !== currentIndex
    );
    return instructors.filter(inst => !usedIds.includes(String(inst.id)));
  }

  /* ---------- Submit (UÆNDRET LOGIK) ---------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dto: EditOccurrenceDto = {
      id: activity.activityId,
      originalStartUtc: activity.originalStartUtc,
      startUtc: dkDateTimeLocalToUtcIso(start),
      endUtc: dkDateTimeLocalToUtcIso(end),
      title,
      description: description || null,
      address: location || null,
      tag: type || null,
      isCancelled: cancelled,
      instructorIds: selectedInstructors.filter(Boolean).map(Number),
    };

    try {
      await upsertOccurrence(dto).unwrap();
      alert("Session opdateret!");
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Fejl ved opdatering");
    }
  }

  /* ---------- RENDER (SAMME LOOK SOM UpdateActivityForm) ---------- */
  return (
    <>
      <AppHeader title="Opdater Session" />
      <div style={{ marginTop: 70 }} />

      <div className="create-activity-container">
        <form className="create-activity-form" onSubmit={handleSubmit}>
          <label>
            Titel *
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            Type *
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="training">Træning</option>
              <option value="events">Begivenhed</option>
            </select>
          </label>

          <label>
            Start tidspunkt *
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>

          <label>
            Slut tidspunkt *
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>

          <label>
            Lokation
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label>
            Instruktører
            {/* <h6>Husk at tilføje instruktør igen <b/> </h6> */}
            {selectedInstructors.map((value, index) => (
              <div key={index} style={{ display: "flex", gap: 12 }}>
                {instructorsLoading ? (
                  <p>Henter...</p>
                ) : (
                  <select
                    value={value}
                    onChange={(e) => updateInstructor(index, e.target.value)}
                  >
                    <option value="">Vælg instruktør</option>
                    {availableOptions(index).map(inst => (
                      <option key={inst.id} value={inst.id}>
                        {inst.firstName}
                      </option>
                    ))}
                  </select>
                )}

                {selectedInstructors.length > 1 && (
                  <button type="button" onClick={() => removeInstructor(index)}>
                    <FiX />
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addInstructor}>
              + Tilføj instruktør
            </button>
          </label>

          <label>
            Beskrivelse
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

        <label
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>Aflyst</span>
          <input
            type="checkbox"
            checked={cancelled}
            onChange={(e) => setCancelled(e.target.checked)}
          />
          
        </label>



          <button className="submit-btn" disabled={isLoading}>
            {isLoading ? "Opdaterer..." : "Opdater Session"}
          </button>
        </form>
      </div>
    </>
  );
}
