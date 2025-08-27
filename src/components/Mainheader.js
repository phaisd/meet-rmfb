import Link from "next/link";
import NavLink from "./NavLink";
import logo from "@/assets/logo.png";
import Image from "next/image";

export default function MainHeader() {
  return (
    <>
      <header id="main-header">
        <div id="logo">
          <Link href="/">
            <Image src={logo.src} alt="All Meeting" width={45} height={45} />
            FBMtRm
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink href="/meets">ประชุมวันนี้</NavLink>
            </li>
            <li>
              <NavLink href="/tableMeets">รวมแสดงผล</NavLink>
            </li>
            <li>
              <NavLink href="/useMeets">ขอใช้บริการ</NavLink>
            </li>
            <li>
              <NavLink href="/userauth">ลงทะเบียน</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
