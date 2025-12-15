import { useEffect, useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useFetchActivityByIdQuery, useUpdateActivityMutation } from "../store/apis/activityAPI";
import { useFetchInstructorsQuery } from "../store/apis/instructorAPI";
import { FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateActivityForm() {
  const { id } = useParams();
  const activityId = Number(id);

  const navigate = useNavigate();

  const { data: activity, isLoading } =
    useFetchActivityByIdQuery(activityId);

  const [updateActivity, { isLoading: isUpdating }] =
    useUpdateActivityMutation();

  const { data: instructors = [], isLoading: instructorsLoading } =
    useFetchInstructorsQuery();

  /* ---------- State ---------- */
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([""]);

  /* ---------- Prefill når activity hentes ---------- */
  useEffect(() => {
    if (!activity) return;

    setTitle(activity.title);
    setType(activity.tags?.[0] ?? "training");
    setStart(activity.startUtc.slice(0, 16));
    setEnd(activity.endUtc.slice(0, 16));
    setImage(activity.image ?? "");
    setLocation(activity.address ?? "");
    setDescription(activity.description ?? "");
    setLink(activity.link ?? "");
    setIsRecurring(activity.isRecurring);

    setSelectedInstructors(
      activity.instructors.length > 0
        ? activity.instructors.map((i) => String(i.id))
        : [""]
    );
  }, [activity]);

  /* ---------- Instruktør helpers ---------- */
  function updateInstructor(index: number, value: string) {
    const list = [...selectedInstructors];
    list[index] = value;
    setSelectedInstructors(list);
  }

  function addInstructor() {
    setSelectedInstructors((prev) => [...prev, ""]);
  }

  function removeInstructor(index: number) {
    setSelectedInstructors((prev) => prev.filter((_, i) => i !== index));
  }

  function availableOptions(currentIndex: number) {
    const usedIds = selectedInstructors.filter(
      (id, i) => id !== "" && i !== currentIndex
    );
    return instructors.filter((inst) => !usedIds.includes(String(inst.id)));
  }

  /* ---------- Submit ---------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const startUtc = new Date(start).toISOString();
    const endUtc = new Date(end).toISOString();

    const instructorObjects = selectedInstructors
      .filter((id) => id !== "")
      .map((id) => instructors.find((i) => i.id === Number(id)))
      .filter(Boolean)
      .map((inst) => ({
        id: inst!.id,
        firstName: inst!.firstName,
        email: inst!.email ?? null,
        number: inst!.number ?? null,
        image: inst!.image ?? null,
      }));

    const updatedActivity = {
        id: activityId,
        title,
        startUtc,
        endUtc,
        address: location,
        description,
        image,
        link,
        cancelled: false,
        instructors: instructorObjects,
        tags: [type],
        isRecurring,
        ...(isRecurring && { rrule: "FREQ=WEEKLY" }),
    };
    try {
      await updateActivity(updatedActivity).unwrap();
      alert("Aktivitet opdateret!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Fejl ved opdatering");
    }
  }

  if (isLoading) return <p>Henter aktivitet...</p>;

  return (
    <>
      <AppHeader title="Opdater Aktivitet" />
      <div style={{ marginTop: 70 }} />

      <div className="create-activity-container">
        <form className="create-activity-form" onSubmit={handleSubmit}>
          <label>
            Titel
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
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
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>

          <label>
            Slut tidspunkt
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>

          <label>
            Lokation
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          <label>
            Instruktører
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
                    {availableOptions(index).map((inst) => (
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
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>
            Link
            <input value={link} onChange={(e) => setLink(e.target.value)} />
          </label>

          <button className="submit-btn" disabled={isUpdating}>
            {isUpdating ? "Opdaterer..." : "Opdater Aktivitet"}
          </button>
        </form>
      </div>
    </>
  );
}
