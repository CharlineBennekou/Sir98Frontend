import { useEffect, useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useFetchActivityByIdQuery, useUpdateActivityMutation } from "../store/apis/api";
import { useFetchInstructorsQuery } from "../store/apis/api";
import { FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import type { UpdateActivityDTO } from "../types/activityDTO";

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

  let postingImage: boolean = false;

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

  function dateToTimezone(date: Date, timezone: string) {
    const year = date.toLocaleTimeString('da-DK', { year:"numeric", timeZone:  timezone }).slice(0,4)
    const month = date.toLocaleTimeString('da-DK', { month:"2-digit", timeZone:  timezone }).slice(0,2)
    const day = date.toLocaleTimeString('da-DK', { day:"2-digit", timeZone:  timezone }).slice(0,2)
    const hour = date.toLocaleTimeString('da-DK', { hour:"2-digit",timeZone:  timezone })
    const minute = date.toLocaleTimeString('da-DK', { minute:"2-digit", timeZone:  timezone })
    return`${year}-${month}-${day}T${hour}:${minute}`;
  }

  /* ---------- Prefill når activity hentes ---------- */
  useEffect(() => {
    if (!activity) return;

    const startDate = dateToTimezone(new Date(activity.startUtc), 'Europe/Copenhagen')
    const endDate = dateToTimezone(new Date(activity.endUtc), 'Europe/Copenhagen')
    
    setTitle(activity.title);
    setType(activity.tag ?? "training");
    setStart(startDate);
    setEnd(endDate);
    setImage(activity.image ?? "");
    setLocation(activity.address ?? "");
    setDescription(activity.description ?? "");
    setLink(activity.link ?? "");
    setIsRecurring(activity.isRecurring);

    setSelectedInstructors(
    Array.isArray(activity.instructors) && activity.instructors.length > 0
        ? activity.instructors.map((i) => String(i.id))
        : [""]
    );
  }, [activity]);


    // ---------- Image upload ----------
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
    }).then((response: Response) => {
      switch (response.status) {
        case 415:
          alert("Filtype ikke understøttet");
          break;
        case 400:
          alert("Billede upload fejlede");
          break;
        case 500:
          alert("Serverfejl");
          break;
        case 200:
          response.text().then((text) => {
            setImage(`${URL}/${text}`);
          });
          alert("Billede uploadet");
          break;
        default:
          response.text().then((text) => alert(text));
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

    const instructorsIDs: number[] = [];
    selectedInstructors.forEach((id) => {
      if (id !== "") {
        instructorsIDs.push(Number(id));
      }
    });
    const updatedActivity: UpdateActivityDTO = {
      id: activityId,
      title,
      startUtc,
      endUtc,
      address: location,
      description: description || "",
      image: image,
      link: link || "",
      cancelled: false,
      instructorids: instructorsIDs,
      tag: type,
      isRecurring,
      ...(isRecurring && { rrule: "FREQ=WEEKLY" }),
    };
    console.log("SENDER: ", updatedActivity);

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
            Billede
            <input
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/tiff, image/avif"
              onChange={(e) => postImage(e.target.files)}
            />
          </label>

          {image && (
            <div>
              <p>Nuvarande billede:</p>
              <img src={image} alt="Instruktør" style={{ width: "150px", borderRadius: "8px" }} />
            </div>
          )}

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
