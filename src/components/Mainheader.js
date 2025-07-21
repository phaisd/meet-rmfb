import Link from "next/link";

export default function MainHeader() {
  return (
    <header>
      <nav>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/meeting">Meeting</Link>
        </ul>
      </nav>
    </header>
  );
}
