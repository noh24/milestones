import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href='/about'>About</Link>
      <div className="text-5xl">Home Page</div>
    </>
  )
}
