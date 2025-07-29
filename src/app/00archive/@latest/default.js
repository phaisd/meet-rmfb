import MeetsList from "@/components/MeetsList";
import { getLatestMeets } from "@/lib/meets";

export default function LatestMeetsPage() {
  const latestMeets = getLatestMeets();

  return (
    <>
      <h2>Latest Meeting</h2>
      <MeetsList meets={latestMeets} />
    </>
  );
}
