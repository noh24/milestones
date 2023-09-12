import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default class CustomSession {
  static async getSessionAndRedirectIfSession() {
    const session = await getServerSession(authOptions)

    if (session) {
      redirect('/')
    }
  }
}