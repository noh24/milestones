import Link from 'next/link'

export default async function Home() {
  return (
    <>
      <Link href='/milestones/add'>Add Milestones</Link>
      <p>
        Milestones is an app to help combat imposter syndome by storing and
        tracking all your wins. We are here to remind you that you&apos;re
        making progress by regularly updating you about your achievements. No
        matter how small or big, we believe in celebrating all our wins.
      </p>
      
      <p>WIP Notes: Put screenshots of Milestones being used</p>
      <p>Examples: Screenshots of milestones and the reminder feature</p>
    </>
  )
}
