import Link from "next/link";
import NavLink from "./NavLink";
import logo from "@/assets/logo.png";

export default function MainHeader() {
  return (
    <>
      <header id="main-header">
        <div id="logo">
          <Link href="/">
            <img src={logo.src} alt="All Meeting" width="45px" />
            FBMtRm
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink href="/meets">Meets</NavLink>
            </li>
            {/* <li>
              <NavLink href="/archive">Archive</NavLink>
            </li> */}
            <li>
              <NavLink href="/useMeets">Use</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
