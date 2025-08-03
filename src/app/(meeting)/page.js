import Link from "next/link";
import logo from '@/assets/logo.png'
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <div id="home">
        <Image src={logo.src} alt="Logo" width={100} height={100} />
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