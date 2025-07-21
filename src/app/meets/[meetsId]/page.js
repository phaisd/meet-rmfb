
export default async function MeetRoomPage({ params }) {
  const meetsId = await params.meetsId;
  return (
    <>
      <div>
        <h1 hidden>{meetsId}</h1>
        <h1>รายละเอียดของการใช้ห้องประชุม : </h1>


      </div>
    </>
  )
}