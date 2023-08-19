import Link from "next/link"
import React, { FC } from "react";
import SignOutButton from "./SignOutButton"

const HeaderNavBar: FC = () => {
  return <nav>
    <Link href='/'>Home</Link>
    <Link href='/get-started'>Get Started</Link>
    <SignOutButton/>
  </nav>
};

export default HeaderNavBar;
