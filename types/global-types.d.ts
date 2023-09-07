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
  userEmail: string
}

type MilestoneDeleteData = {
  id: string
  documentPath: string | null
}

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  password: string | null
  emailVerified: Date | null
  image: string | null
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

type Milestone = {
  id: string
  date: Date
  createdAt: Date
  updatedAt: Date
  title: string
  content: string
  type: string
  document: string | null
  userId: string
}

type GetMilestoneApiResponse = {
  success: boolean
  data: Milestone[] | null
  error: null | string
}

type DeleteMilestoneApiResponse = {
  success: boolean
  data: string | null
  error: null | string
}
