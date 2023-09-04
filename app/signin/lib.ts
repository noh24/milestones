import { getProviders, signIn } from 'next-auth/react'

export const getAllProviders = async () => {
  const providers = await getProviders()
  if (!providers) throw new Error()
  return Object.values(providers).sort((a, b) => a.name < b.name ? -1 : 0)
}

export const signInWithProviders = async ({
  providerId, userData
}: {
  providerId?: string
  userData: UserSignInData
}) => {
  if (providerId === 'credentials') {
    const res = await signIn(providerId, {
      email: userData.email,
      password: userData.password,
      callbackUrl: '/',
      redirect: false,
    })

    if (res?.error)
      throw new Error('You have entered the wrong email or password.')

  } else {
    const res = await signIn(providerId, {})
    if (res?.error) throw new Error()
  }
}