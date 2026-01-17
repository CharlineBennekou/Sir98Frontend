import { useEffect, useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

import {
  useFetchOccurrenceQuery,
  useUpsertOccurrenceMutation,
  useFetchInstructorsQuery,
} from "../store/apis/api";

import type { EditOccurrenceDto } from "../types/newEditOccurrenceDTO";

type Props = {
  activityId: number;
  originalStartUtc: string;
  open: boolean;
  onClose: () => void;
};


export default function UpdateOccurrenceForm({
  activityId,
  originalStartUtc,
  open,
  onClose,
}: Props) {
  const navigate = useNavigate();

  // Hent den enkelte occurrence
  const { data: occurrence, isLoading } = useFetchOccurrenceQuery({
    activityId,
    originalStartUtc,
  });

  const [upsertOccurrence, { isLoading: isUpdating }] =
    useUpsertOccurrenceMutation();

  const { data: instructors = [], isLoading: instructorsLoading } =
    useFetchInstructorsQuery();

  let postingImage = false;

  /* ---------- State ---------- */
  const [title, setTitle] = useState("");
  const [type, setType] = useState("training");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([""]);

  /* ---------- Helper: UTC → local datetime-local ---------- */
  function dateToTimezone(date: Date, timezone: string) {
    const year = date
      .toLocaleTimeString("da-DK", { year: "numeric", timeZone: timezone })
      .slice(0, 4);
    const month = date
      .toLocaleTimeString("da-DK", { month: "2-digit", timeZone: timezone });
    const day = date
      .toLocaleTimeString("da-DK", { day: "2-digit", timeZone: timezone });
    const hour = date
      .toLocaleTimeString("da-DK", { hour: "2-digit", timeZone: timezone });
    const minute = date
      .toLocaleTimeString("da-DK", { minute: "2-digit", timeZone: timezone });

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  console.log("Props received in UpdateOccurrenceForm:", { activityId, originalStartUtc });
  /* ---------- Prefill felter når occurrence hentes ---------- */
  useEffect(() => {
    if (!occurrence) return;

    setTitle(occurrence.title);
    setType(occurrence.tag ?? "training");
    setStart(dateToTimezone(new Date(occurrence.startUtc), "Europe/Copenhagen"));
    setEnd(dateToTimezone(new Date(occurrence.endUtc), "Europe/Copenhagen"));
    setImage(occurrence.image ?? "");
    setLocation(occurrence.address ?? "");
    setDescription(occurrence.description ?? "");
    setLink(occurrence.link ?? "");
    setCancelled(occurrence.cancelled ?? false);

    setSelectedInstructors(
      occurrence.instructors?.length
        ? occurrence.instructors.map((i) => String(i.id))
        : [""]
    );
  }, [occurrence]);

  /* ---------- Image upload (UI only) ---------- */
  async function postImage(images: FileList | null): Promise<void> {
    if (!images || !images[0]) {
      alert("Intet billede valgt");
      return;
    }

    postingImage = true;

    const form = new FormData();
    form.set("images", images[0]);

    const URL =
      "https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/Image";

    fetch(URL, {
      method: "POST",
      body: form,
    }).then((response) => {
      if (response.ok) {
        response.text().then((text) => setImage(`${URL}/${text}`));
        alert("Billede uploadet");
      } else {
        alert("Fejl ved upload");
      }
      postingImage = false;
    });
  }

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

    if (postingImage) {
      alert("Billede bliver uploadet");
      return;
    }

    const startUtc = new Date(start).toISOString();
    const endUtc = new Date(end).toISOString();

    const dto: EditOccurrenceDto = {
      activityId,
      originalStartUtc, // brug props direkte
      startUtc,
      endUtc,
      title,
      description: description || null,
      address: location || null,
      tag: type || null,
      isCancelled: cancelled,
      instructorIds: selectedInstructors.filter((id) => id !== "").map(Number),
    };

    try {
      await upsertOccurrence(dto).unwrap();
      alert("Session opdateret!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Fejl ved opdatering af session");
    }
  }

  if (isLoading) return <p>Henter session...</p>;

  return (
    <>
      <AppHeader title="Opdater Session" />
      <div style={{ marginTop: 70 }} />

      <div className="create-activity-container">
        <form className="create-activity-form" onSubmit={handleSubmit}>
          {/* Titel */}
          <label>
            Titel *
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          {/* Type / tag */}
          <label>
            Type *
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="training">Træning</option>
              <option value="events">Begivenhed</option>
            </select>
          </label>

          {/* Billede */}
          <label>
            Billede
            <input
              type="file"
              accept="image/*"
              onChange={(e) => postImage(e.target.files)}
            />
          </label>
          {image && <img src={image} alt="Session" style={{ width: 150, borderRadius: 8 }} />}

          {/* Start / end */}
          <label>
            Start tidspunkt *
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>
            Slut tidspunkt *
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>

          {/* Adresse */}
          <label>
            Lokation
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>

          {/* Instruktører */}
          <label>
            Instruktører
            {selectedInstructors.map((value, index) => (
              <div key={index} style={{ display: "flex", gap: 12 }}>
                {instructorsLoading ? (
                  <p>Henter...</p>
                ) : (
                  <select value={value} onChange={(e) => updateInstructor(index, e.target.value)}>
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

          {/* Beskrivelse */}
          <label>
            Beskrivelse
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          {/* Link */}
          <label>
            Link
            <input value={link} onChange={(e) => setLink(e.target.value)} />
          </label>

          {/* Aflyst */}
          <label>
            <input type="checkbox" checked={cancelled} onChange={(e) => setCancelled(e.target.checked)} />
            Aflyst
          </label>

          <button className="submit-btn" disabled={isUpdating}>
            {isUpdating ? "Opdaterer..." : "Opdater Session"}
          </button>
        </form>
      </div>
    </>
  );
}
