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
              <NavLink href="/meets">MeetToday</NavLink>
            </li>
            <li>
              <NavLink href="/tableMeets">Preview</NavLink>
            </li>
            <li>
              <NavLink href="/useMeets">Use</NavLink>
            </li>
            <li>
              <NavLink href="/userauth">Service</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
