export default function MeetingRoomPage({ params }) {
  const meetId = params.meetId;
  return (
    <>
      <h1>รายละเอียดของการใช้ห้องประชุม : {meetId}</h1>
    </>
  );
}
