import { useState } from "react";
import "./../styles/CreateActivityFormStyle.css";
import AppHeader from "../components/layout/AppHeader";
import {
  useCreateInstructorMutation,
  useUploadImageMutation,
} from "../store/apis/api";
import { useNavigate } from "react-router-dom";


export default function CreateInstructorForm() {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");

  const [createInstructor, { isLoading, isSuccess, isError }] =
    useCreateInstructorMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
  useUploadImageMutation();

  // ---------- Image upload ----------
  async function postImage(images: FileList | null): Promise<void> {
  if (!images || !images[0]) {
    alert("Intet billede valgt");
    return;
  }

  try {
    const imageUrl = await uploadImage(images[0]).unwrap();
    setImage(imageUrl);
    alert("Billede uploadet");
  } catch (err: any) {
    console.error(err);

    const status = err?.status;

    switch (status) {
      case 415:
        alert("Filtype ikke understøttet");
        break;
      case 400:
        alert("Billede upload fejlede");
        break;
      case 500:
        alert("Serverfejl");
        break;
      default:
        alert("Fejl ved upload af billede");
        break;
    }
  }
}

  // ---------- Submit ----------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

   if (isUploadingImage) {
  alert("Billede bliver uploadet");
  return;
}

    const newInstructor = {
      firstName,
      email,
      number,
      image,
    "activities": [],
    "changedActivities": []
    };

    console.log("SENDER:", newInstructor);

    try {
      await createInstructor(newInstructor).unwrap();
      alert("Instruktør oprettet!");

      navigate("/instructor"); // Naviger tilbage til liste

      // Reset
      setFirstName("");
      setEmail("");
      setNumber("");
      setImage("");
    } catch (err) {
      console.error(err);
      alert("Fejl ved oprettelse af instruktør");
    }
  }

  return (
    <>
      <AppHeader title="Opret Instruktør" />

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

          <button
           type="submit"
            className="submit-btn"
            disabled={isLoading || isUploadingImage}
          >
             {isLoading
             ? "Opretter..."
             : isUploadingImage
            ? "Uploader billede..."
            : "Opret Instruktør"}
           </button>

          {isSuccess && <p style={{ color: "green" }}>Instruktør oprettet!</p>}
          {isError && <p style={{ color: "red" }}>Der opstod en fejl.</p>}
        </form>
      </div>
    </>
  );
}
