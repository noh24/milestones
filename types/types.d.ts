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

type CreateMilestoneApiResponse = {
  success: boolean
  data: string | null
  error: string | null
}

type UpdateMilestoneApiResponse = {
  success: boolean
  data: string | null
  error: string | null
}

type GetManyMilestonesResponse = {
  success: boolean
  data: Milestone[] | null
  error: null | string
}

type GetOneMilestoneResponse = {
  success: boolean
  data: Milestone | null,
  error: null | string
}

type DeleteMilestoneApiResponse = {
  success: boolean
  data: string | null
  error: null | string
}
