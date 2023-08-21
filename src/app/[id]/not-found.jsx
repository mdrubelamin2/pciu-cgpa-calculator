import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: 'red' }}>Invalid Student ID!</h1>
      <Link href="/" style={{ textAlign: 'center' }}>Go back to home</Link>
    </div>
  )
}