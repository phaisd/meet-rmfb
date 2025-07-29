"use server";

export async function opreateMeets(formData) {
  const rawData = Object.fromEntries(formData.entries());
  const { id, ...data } = rawData;

  const url = id ? "/api/meets" : "/api/meets";

  await fetch(url, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawData),
  });
}
