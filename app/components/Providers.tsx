'use client'
import { LiteralUnion, ClientSafeProvider, signIn } from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers/index'
import { FC } from 'react'

type TProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | {}
}

const Providers: FC<TProps> = ({ providers }) => {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
}

export default Providers
