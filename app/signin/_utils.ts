import { UserSignInData } from '@/types/types'
import { getProviders, signIn } from 'next-auth/react'
import type { ClientSafeProvider } from 'next-auth/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

export const getAllProviders = async () => {
  const providers = await getProviders()

  if (!providers) {
    throw new Error()
  }

  return Object.values(providers).sort((a, b) => a.name < b.name ? -1 : 0)
}

export const signInWithProviders = async ({
  provider, userData, router, redirect
}: {
  provider: ClientSafeProvider
  userData: UserSignInData
  router: AppRouterInstance
  redirect: string
}) => {
  // nextAuth res object returns ok: true / status: 200 - no matter what!! 
  // hotfix: use error or url for conditionals

  switch (provider.id) {
    case 'credentials':
      const credentialsRes = await signIn(provider.id, {
        email: userData.email,
        password: userData.password,
        callbackUrl: '/',
        redirect: false,
      })

      if (credentialsRes?.error) {
        throw new Error('You have entered the wrong email or password.')
      } else {
        setTimeout(() => {
          router.prefetch(`/${redirect}`)
          router.push(`/${redirect}`)
        }, 1500)

        await fetch(`/api/revalidate?path=${redirect}&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
          method: 'POST'
        })
        return true
      }

    default:
      const res = await signIn(provider.id, {
        callbackUrl: `/${redirect}`
      })

      if (res?.error) {
        throw new Error(`Sign in with ${provider.name} failed.`)
      } else {
        return provider.name
      }
  }
}