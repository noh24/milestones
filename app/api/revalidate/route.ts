import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')
    const path = req.nextUrl.searchParams.get('path')

    if (secret !== process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN) {
      return NextResponse.json({ success: false, data: null, error: 'Invalid secret token.' })
    }

    if (!path) {
      throw new Error('No path provided.')
    }

    revalidatePath(path)

    return NextResponse.json({ success: true, data: `${path} has been revalidated`, error: null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, data: null, error: String(err) }, { status: 401 })
  }
}