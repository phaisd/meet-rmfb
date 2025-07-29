import MeetsList from "@/components/MeetsList";
import { getLatestMeets } from "@/lib/meets";

export default function LatestMeetsPage() {
  const latestMeets = getLatestMeets();

  return (
    <>
      <h3>Latest Meeting</h3>
      <MeetsList meets={latestMeets} />
    </>
  );
}
