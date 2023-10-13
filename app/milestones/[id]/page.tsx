import CustomSession from '@/app/_server_utils/customSession'
import React from 'react'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/db'
import { Milestone } from '@prisma/client'
import Image from 'next/image'

type TProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: TProps) {
  const session = await CustomSession.getServerSession()

  if (!session) {
    redirect(`/signin?redirect=milestones/${params.id}`)
  }

  const { success, data, error } = await findMilestone({
    milestoneId: params.id,
  })

  if (error) {
    return <p>{error}</p>
  }

  const { id, date, title, content, type, documentPath, documentName } =
    data as Milestone

  return (
    <article>
      <h2>{title}</h2>
      <h5>{date.toDateString()}</h5>
      <p>{content}</p>
      <span>{type}</span>
      <h4>{documentName}</h4>
      <h4>{documentPath}</h4>
      {/* <iframe src={documentPath}></iframe> */}
      {/* <iframe
        className=''
        width='100%'
        height='600'
        src={`https://docs.google.com/gview?url=${documentPath}&embedded=true`}
      ></iframe> */}
      <p>{parsePath(documentPath)}</p>
      <Image
        src={parsePath(documentPath)}
        alt={documentName}
        width={300}
        height={500}
      ></Image>
    </article>
  )
}

function parsePath(documentPath) {
  const path = documentPath.split('uploads').slice(-1).toString().substring(1)
  console.log(path)
  // return path
  return '/../../uploads/' + path
}

export async function findMilestone({
  milestoneId,
}: {
  milestoneId: string
}): Promise<{
  success: boolean
  data: Milestone | string
  error: string
}> {
  try {
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
      },
    })

    if (!milestone) {
      throw Error('No Milestone Found')
    }

    return {
      success: true,
      data: milestone,
      error: '',
    }
  } catch (err) {
    console.error('Error Milestones [id]: ' + String(err))

    return {
      success: false,
      data: '',
      error: String(err),
    }
  }
}
