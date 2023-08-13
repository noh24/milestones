// Next Auth Providers
type ProvidersType = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null

interface ExtendedRequest extends Request {
  body: ReadableStream<Uint8Array> & {
    name?: string
    email: string
    password: string
  }
}