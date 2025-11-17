import React from "react";
import { useFetchActivitiesQuery } from "../../store/apis/activityAPI";

export default function ActivityTestingData() {
  const { data, error, isLoading } = useFetchActivitiesQuery();

  console.log("Activities data:", data);
  console.log("Error:", error);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}
