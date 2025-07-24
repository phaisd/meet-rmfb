import Link from "next/link";
import NavLink from "./NavLink";

export default function MainHeader() {
  return (
    <>
      <header id="main-header">
        <div id="logo">
          <Link href="/">
            {/* <img src={`./assets/images/logo.png`} alt="logo" /> */}
            FbMeetsRoom
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink href="/meets">Meets</NavLink>
            </li>
            <li>
              <NavLink href="archive">Archive</NavLink>
            </li>
            <li>
              <NavLink href="useMeets">Use</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
