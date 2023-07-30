import React from 'react'
import StandardLayout from '@/app/layouts/standard'
import Link from 'next/link'

const About = () => {
  return (
    <StandardLayout>
      <Link href='/'>Home</Link>
      <div>About</div>
    </StandardLayout>
  )
}

export default About
