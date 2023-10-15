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
      {<h4>{documentName}</h4> ?? ''}
      {documentPath.endsWith('.pdf') ? (
        <iframe src={parsePath(documentPath)} width={500} height={700}></iframe>
      ) : (
        ''
      )}
      {documentPath.endsWith('.jpeg') || documentPath.endsWith('.png') || documentPath.endsWith('.jpg') ? (
        <Image
          src={parsePath(documentPath)}
          alt={documentName}
          width={300}
          height={500}
          priority
        ></Image>
      ) : (
        ''
      )}
    </article>
  )
}

function parsePath(documentPath: string): string {
  return '/uploads/' + documentPath
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
