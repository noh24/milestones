import React, { FC } from 'react'
import Link from 'next/link'
import { getMilestones } from './_utils'

const Milestones: FC = async () => {
  const { success, data, error } = await getMilestones()

  if (error) return <div>{String(error)}</div>
  if (success && data!.length === 0) {
    return (
      <>
        <Link href='/milestones/add'>Add Milestones</Link>
        <div>
          There are no milestones associated to this account. Please add your
          first milestone!
        </div>
      </>
    )
  }
  return (
    <>
      <div>
        {data!.map(({ id, title, content, type, document, date }) => (
          <div key={id}>
            <h2>{title}</h2>
            <p>{content}</p>
            <p>{type}</p>
            <p>{date.toDateString()}</p>
            <p>{document}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Milestones
