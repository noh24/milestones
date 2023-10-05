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
  document: File | string
  userEmail: string
}

type EditMilestoneFormData = {
  title: string
  content: string
  type: string
  date: string
  document: File | string
  documentPath: string
  documentName: string
  id: string
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
  document : File | string
  documentPath: string
  id: string
}

type SignUpApiResponse = {
  success: boolean
  data: string
  error: string
}

type SignInApiResponse = {
  success: boolean
  data: User | string
  error: string
}

type MilestoneApiResponse = {
  success: boolean
  data: Milestone | Milestone[] | string
  error: string
}