import React from "react";
import { useFetchActivitiesQuery } from "../../store/apis/activityAPI";
import { useFetchInstructorsQuery } from "../../store/apis/instructorAPI";

export default function ActivityTestingData() {
  const {
    data: activities,
    error: activitiesError,
    isLoading: activitiesLoading
  } = useFetchActivitiesQuery();

  const {
    data: instructors,
    error: instructorsError,
    isLoading: instructorsLoading
  } = useFetchInstructorsQuery();

  if (activitiesLoading || instructorsLoading) return <p>Loading…</p>;
  if (activitiesError || instructorsError) return <p>Error loading data</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // centers the content
        gap: "200px",           // increased spacing between the two blocks
        padding: "20px",       // padding around the whole layout
        alignItems: "flex-start"
      }}
    >
      {/* Activities */}
      <div
        style={{
          width: "50%",
          padding: "20px",
          borderRadius: "6px"
        }}
      >
        <h2>Activities</h2>
        <pre>{JSON.stringify(activities, null, 2)}</pre>
      </div>

      {/* Instructors */}
      <div
        style={{
          width: "50%",
          padding: "20px",
          borderRadius: "6px"
        }}
      >
        <h2>Instructors</h2>
        <pre>{JSON.stringify(instructors, null, 2)}</pre>
      </div>
    </div>
  );
}
