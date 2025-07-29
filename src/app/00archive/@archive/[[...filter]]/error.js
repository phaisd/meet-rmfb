"use client";

export default function ArchiveFelterError({ error }) {
  return (
    <div id="error">
      <h1>Error!! An error occurred!!</h1>
      <p>{error.message || "Invalid filter value!"}</p>
    </div>
  );
}
