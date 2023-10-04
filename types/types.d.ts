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

type CreateMilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
  document?: File | null
  userEmail: string
}

type EditMilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
  document? : File | null
  documentPath?: string
  documentName?: string
  userEmail?: string
  id?: string
}

type ParsedCreateMilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
}

type ParsedEditMilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
  document? : File | null
  documentPath?: string
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