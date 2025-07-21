import Link from "next/link";

export default function MainHeader() {
  return (
    <>
      <header id="main-header">
        <div id="logo"><Link href="/">FbMeetsRoom</Link></div>
        <nav>
          <ul>
            <li><Link href="/meets">Meeting</Link></li>
          </ul>
        </nav>
      </header>
    </>
  )
}