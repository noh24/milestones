// Next Auth Providers
type ProvidersType = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null

type UserData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type MilestoneData = {
  title: string
  content: string
  type: string
  date: string
  document: File | Null
}