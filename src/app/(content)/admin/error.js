"use client";

export default function opreateNews({ error }) {
  return (
    <>
      <h2>An error occorred!</h2>
      <p>Unfortunately, something went wrong.</p>
      <p>{error.message}</p>
    </>
  );
}
