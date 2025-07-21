import Link from "next/link";

export default function MeetingPage() {
  return (
    <>
      <h1>Meeting Room : การใช้ห้องประชุม</h1>
      <ul>
        <li>
          <Link href="/meeting/meet_1">Create Room 1 </Link>
          <Link href="/meeting/meet_2">Create Room 2 </Link>
          <Link href="/meeting/meet_3">Create Room 3 </Link>
          <Link href="/meeting/meet_4">Create Room 4 </Link>
        </li>
      </ul>
    </>
  );
}
