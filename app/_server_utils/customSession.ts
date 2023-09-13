import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default class CustomSession {
  static async getServerSession() {
    return getServerSession(authOptions)
  }
}