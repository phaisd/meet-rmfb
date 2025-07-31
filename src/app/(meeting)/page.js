import Link from "next/link";
import logo from '@/assets/logo.png'


export default function HomePage() {
  return (
    <>
      <div id="home">
        <img src={logo.src} alt="A Consultation" />
        <h1>Use Consultation </h1>
        <p>
          FBMTROOM ให้บริการการขอใช้ห้องประชุมประจำคณะ!!
        </p>
        <p>
          สำนักงานคณบดี พร้อมให้บริการระบบการขอใช้ประชุมประจำคณะ  ทั้งแบบแอปพลิเคชันและออนไล์
        </p>
        <p>
          <Link href="/meets">การขอใช้บริการ</Link>
          {/* <Link href="/about">เกี่ยวกับเรา</Link> */}
        </p>

      </div>
    </>
  )
}