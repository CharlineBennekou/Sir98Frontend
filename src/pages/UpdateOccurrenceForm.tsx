import { useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { FiX } from "react-icons/fi";
import { useUpsertOccurrenceMutation, useFetchInstructorsQuery } from "../store/apis/api";
import type { EditOccurrenceDto } from "../types/newEditOccurrenceDTO";
import type { ActivityOccurrence } from "../types/activityOccurrence";

type Props = {
  activity: ActivityOccurrence; // hele aktiviteten sendes som prop
  open: boolean;
  onClose: () => void;
};

export default function UpdateOccurrenceForm({ activity, open, onClose }: Props) {
  const { data: instructors = [] } = useFetchInstructorsQuery();
  const [upsertOccurrence, { isLoading: isUpdating }] = useUpsertOccurrenceMutation();

  // Prefyld felter direkte fra props
  const [title, setTitle] = useState(activity.title);
  const [type, setType] = useState(activity.tag ?? "training");
  const [start, setStart] = useState(activity.startUtc.slice(0,16));
  const [end, setEnd] = useState(activity.endUtc.slice(0,16));
  const [location, setLocation] = useState(activity.address ?? "");
  const [description, setDescription] = useState(activity.description ?? "");
  const [link, setLink] = useState(activity.link ?? "");
  const [cancelled, setCancelled] = useState(activity.cancelled ?? false);
  const [selectedInstructors, setSelectedInstructors] = useState(
    activity.instructors?.map(i => String(i.id)) || [""]
  );

  if (!open) return null;

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
    const usedIds = selectedInstructors.filter((id, i) => id !== "" && i !== currentIndex);
    return instructors.filter(inst => !usedIds.includes(String(inst.id)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dto: EditOccurrenceDto = {
      activityId: activity.activityId,
      originalStartUtc: activity.startUtc,
      startUtc: new Date(start).toISOString(),
      endUtc: new Date(end).toISOString(),
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
      onClose();
    } catch (err) {
      console.error(err);
      alert("Fejl ved opdatering");
    }
  }

  return (
    <div className="update-occurrence-overlay">
      <AppHeader title="Opdater Session" />
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
            Start *
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>

          <label>
            Slut *
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>

          <label>
            Lokation
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label>
            Instruktører
            {selectedInstructors.map((value, index) => (
              <div key={index} style={{ display: "flex", gap: 8 }}>
                <select value={value} onChange={(e) => updateInstructor(index, e.target.value)}>
                  <option value="">Vælg instruktør</option>
                  {availableOptions(index).map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.firstName}</option>
                  ))}
                </select>
                {selectedInstructors.length > 1 && (
                  <button type="button" onClick={() => removeInstructor(index)}>
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addInstructor}>+ Tilføj instruktør</button>
          </label>

          <label>
            Beskrivelse
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>
            Link
            <input value={link} onChange={(e) => setLink(e.target.value)} />
          </label>

          <label>
            <input type="checkbox" checked={cancelled} onChange={(e) => setCancelled(e.target.checked)} />
            Aflyst
          </label>

          <button className="submit-btn" disabled={isUpdating}>
            {isUpdating ? "Opdaterer..." : "Opdater Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
