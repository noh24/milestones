'use client'

import React, { FC } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

const Milestone: FC = () => {
  const { data: session } = useSession()
  if (!session) redirect('/signin')

  return (
    <>
      <div>Add Milestones</div>
      <form>
        <input name='title' type='text' placeholder='Title' />
        <textarea name='content' placeholder='Enter milestone details' />
        <label>
          <input name='type' type='radio' value='professional' />
          Professional
        </label>
        <label>
          <input name='type' type='radio' value='personal' />
          Personal
        </label>
        <label>
          Upload image or file:
          <input name='document' type='file' />
        </label>
      </form>
    </>
  )
}

export default Milestone
