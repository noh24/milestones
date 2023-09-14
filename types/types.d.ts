import type { Milestone, User } from "@prisma/client"

type UserSignUpData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type UserSignInData = {
  email: string
  password: string
}

type MilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
  document: File | string
  userEmail?: string
  id?: string
  userId?: string
}

type SignUpApiResponse = {
  success: boolean
  data: string | null
  error: string | null
}

type SignInApiResponse = {
  success: boolean
  data: User | null
  error: string | null
}

type MilestoneApiResponse = {
  success: boolean
  data: Milestone | Milestone[] | null
  error: string | null
}