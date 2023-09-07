import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get('path')

    if (!path) throw new Error('No path provided.')

    revalidatePath(path)
    return NextResponse.json({ success: true, data: `${path} has been revalidated`, error: null })
  } catch (err) {
    return NextResponse.json({ success: false, data: null, error: String(err) })
  }
}