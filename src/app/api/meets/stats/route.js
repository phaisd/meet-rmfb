import { getAllMeets } from "@/lib/meets.js";

export async function GET() {
  const stats = {};
  const meetsList = await getAllMeets(); // ✅ รองรับ async

  for (const meet of meetsList) {
    const dateUse = meet.dateUse || "";
    const monthYear = dateUse.slice(3); // "05-August-2025" ➜ "August-2025"
    stats[monthYear] = (stats[monthYear] || 0) + 1;
  }

  return Response.json(stats);
}