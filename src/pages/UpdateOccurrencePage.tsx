import { useLocation, useNavigate } from "react-router-dom";
import EditOccurrence from "./EditOccurrence"; // <-- ny komponent
import type { ActivityOccurrence } from "../types/activityOccurrence";

const UpdateOccurrencePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { activity?: ActivityOccurrence };

  if (!state?.activity) {
    // Hvis vi af en eller anden grund ikke har activity, gå tilbage
    navigate(-1);
    return null;
  }

  const { activity } = state;

  return (
    <EditOccurrence
      activity={activity}
      onSaved={() => navigate(-1)} // går tilbage til forrige side efter save
    />
  );
};

export default UpdateOccurrencePage;
