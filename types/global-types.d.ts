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

type MilestoneData = {
  title: string
  content: string
  type: string
  date: string
  document: File | string
  userEmail: string
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

interface SignUpApiResponse {
  success: boolean
  data: string | null
  error: string | null
}

interface SignInApiResponse {
  success: boolean
  data: User | null
  error: string | null
}

interface CreateMilestoneApiResponse {
  success: boolean
  data: string | null
  error: string | null
}
