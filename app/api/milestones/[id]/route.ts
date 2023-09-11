import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string | null } }) {
  const id = params.id
  console.log(id)

  return NextResponse.json({ success: true, data: '', error: null })
}