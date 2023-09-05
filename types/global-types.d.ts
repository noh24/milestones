// Next Auth Providers
type ProvidersType = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null

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
  document: File | Null
  userEmail: string
}

interface SignUpAPIResponse {
  success: boolean
  data: string | null
  error: string | null
}