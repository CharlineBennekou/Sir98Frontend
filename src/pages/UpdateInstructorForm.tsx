import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import {
  useFetchInstructorByIdQuery,
  useUpdateInstructorMutation,
} from "../store/apis/api";


export default function UpdateInstructorForm() {
  const { id } = useParams<{ id: string }>();
  const instructorId = Number(id);
  const navigate = useNavigate();

  const { data: instructor, isLoading, isError } = useFetchInstructorByIdQuery(instructorId);
  const [updateInstructor, { isLoading: isUpdating, isSuccess, isError: updateError }] =
    useUpdateInstructorMutation();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");
  let postingImage: boolean = false;

  // ---------- Prefill form ----------
  useEffect(() => {
    if (instructor) {
      setFirstName(instructor.firstName);
      setEmail(instructor.email);
      setNumber(instructor.number);
      setImage(instructor.image);
    }
  }, [instructor]);

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

  // ---------- Submit ----------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (postingImage) {
      alert("Billede bliver uploadet");
      return;
    }

    const updatedInstructor = {
      id: instructorId,
      firstName,
      email,
      number,
      image,
    };

    try {
      await updateInstructor(updatedInstructor).unwrap();
      alert("Instruktør opdateret!");
      navigate("/instructor"); // Naviger tilbage til liste
    } catch (err) {
      console.error(err);
      alert("Fejl ved opdatering af instruktør");
    }
  }

  if (isLoading) return <p>Indlæser instruktør...</p>;
  if (isError) return <p>Kunne ikke hente instruktør.</p>;

  return (
    <>
      <AppHeader title="Opdater Instruktør" />
      <div className="create-activity-container">
        <form className="create-activity-form" onSubmit={handleSubmit}>
          <label>
            Navn *
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Telefon
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
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

          <button type="submit" className="submit-btn" disabled={isUpdating}>
            {isUpdating ? "Opdaterer..." : "Opdater Instruktør"}
          </button>

          {isSuccess && <p style={{ color: "green" }}>Instruktør opdateret!</p>}
          {updateError && <p style={{ color: "red" }}>Der opstod en fejl.</p>}
        </form>
      </div>
    </>
  );
}
