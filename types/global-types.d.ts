// Next Auth Providers
type ProvidersType = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  password: string | null
  emailVerified: Date | null
  image: string | null
}