'use client'

import { signOut, useSession } from "next-auth/react"
import React, { useEffect, useState } from "react";

const SignOutButton = () => {
  const session = useSession()
  console.log(session)
  
  const [signInOrOut, setSignInOrOut] = useState('')
  
  useEffect(() => {
    console.log(session)
    if (session.status !== 'authenticated') {
      setSignInOrOut('Sign In')
    } else {
      setSignInOrOut('Sign Out')
    }
  }, [session])


  return <button onClick={() => signOut()}>{signInOrOut}</button>
};

export default SignOutButton;
