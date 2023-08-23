import prisma from "@/db"
import { validateType } from "@/lib/helper"
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { title, content, type, date, document, userEmail } = await req.json()

  try {
    if (document) {
      const isValid = validateType(document.type)
      if (!isValid) throw new Error('Document type is not acceptable MIME type.')
    }

    const user = await prisma.user.findFirst({
      where: {
        email: userEmail
      }
    })

    if (!user) throw new Error('There is no user associated with email provided.')

    // figure out how to save it into local file (use multer maybe?)

    const newMilestone = await prisma.milestone.create({
      data: {
        title,
        content,
        type,
        date,
        userId: user.id,
      }
    })

    return NextResponse.json({ message: 'Successfully created a milestone', data: newMilestone }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: `${err}` }, { status: 400 })
  }

}

// receive the reqest header
// deconstruct it
// if a document file exist > validate type > if false, throw error
// 