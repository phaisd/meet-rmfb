import Link from "next/link"
export default function AboutPage() {
  return (
    <>
      <section id="home">
        <h1>About FB_MeetingRoom</h1>
        <p>
          FB_Meet_Room คือ ส่วนการให้บริการการขอใช้ห้องประชุมประจำคณะฯ
          ในระบบออนไลน์และระบบแอปพลิเคชันบนอุปกรณ์พกพา
        </p>
        <Link href="/">กลับไปหน้าหลัก</Link>
      </section>
    </>
  )
}