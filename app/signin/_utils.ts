import { getProviders, signIn } from 'next-auth/react'
import type { ClientSafeProvider } from 'next-auth/react'

export const getAllProviders = async () => {
  const providers = await getProviders()
  if (!providers) throw new Error()
  return Object.values(providers).sort((a, b) => a.name < b.name ? -1 : 0)
}

export const signInWithProviders = async ({
  provider, userData
}: {
  provider: ClientSafeProvider
  userData: UserSignInData
}) => {
  if (provider.id === 'credentials') {
    const res = await signIn(provider.id, {
      email: userData.email,
      password: userData.password,
      callbackUrl: '/',
      redirect: false,
    })

    if (res?.error) {
      throw new Error('You have entered the wrong email or password.')
    }

  } else {
    const res = await signIn(provider.id, {})

    if (res?.error) {
      throw new Error(`Sign in with ${provider.name} failed`)
    }
  }
}