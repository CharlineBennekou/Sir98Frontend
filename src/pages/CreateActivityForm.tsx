import { useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import { useCreateActivityMutation } from "../store/apis/api";
import { useFetchInstructorsQuery } from "../store/apis/api";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { CreateActivityDTO } from "../types/activityDTO";

export default function CreateActivityForm() {
  var postingImage: boolean = false;
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

  const navigate = useNavigate();

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


  //https://stackoverflow.com/questions/60782060/cannot-post-a-multipart-form-data-using-fetch-typescript
  async function postImage(images: FileList | null): Promise<void> {
    if(!images) {
      alert("Intet billede");
      return;
    }
    if(!images[0]) {
      alert("Intet billede");
      return;
    }
    const form = new FormData();
    form.set("images", images[0])
    const URL = 'https://sir98backendv3-hbbdgpawc0a8a3fp.canadacentral-01.azurewebsites.net/api/Image';
    //const URL = "https://localhost:7275/api/Image";
    fetch(URL, {
        method: 'POST',
        body: form
    }).then((response: Response) => {
      switch(response.status){
        case 415:
          alert("Fil type er ikke understøttet")
          break;
        case 400: 
          alert("Billede upload fejlede")
          break;
        case 500:
          alert("Server fejl")
          break;
        case 200:
          response.text().then(text => {
            setImage(`${URL}/${text}`)
          });
          alert("Billede uploadet")
          break;
        default:
          response.text().then(text => {
            alert(text)
          });
      }
      postingImage = false;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if(postingImage) {
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

    const newActivity: CreateActivityDTO = {
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
      rrule: isRecurring ? `FREQ=WEEKLY` : undefined,
    };

    console.log("SENDER:", newActivity);

    try {
      await createActivity(newActivity).unwrap();
      alert("Aktivitet oprettet!");
      navigate("/"); // Naviger tilbage til liste

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
            Billede
            <input type="file" accept="image/png, image/jpeg, image/svg+xml, image/tiff, image/avif" onChange={(e) => postImage(e.target.files)} />
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
