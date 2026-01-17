import { useParams, useLocation } from "react-router-dom";
import UpdateOccurrenceForm from "../pages/UpdateOccurrenceForm";

export default function UpdateOccurrenceFormWrapper() {
const { activityId } = useParams();
const location = useLocation();
const query = new URLSearchParams(location.search);
const originalStartUtc = query.get("originalStartUtc");
  if (!activityId || !originalStartUtc) return <p>Ugyldig session</p>;

  return (
    <UpdateOccurrenceForm
      activityId={Number(activityId)}
      originalStartUtc={originalStartUtc}
      open={true}
      onClose={() => window.history.back()} // Luk formen og gå tilbage
    />
  );
}
