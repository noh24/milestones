import { useQuery } from '@tanstack/react-query'
import { getProviders, signIn } from 'next-auth/react'
import Loading from '@/app/loading'

const OAuthProviders = () => {
  const providers = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const providers = await getProviders()
      if (!providers) throw new Error('No Providers Available')
      return providers
    },
    select: (data) =>
      Object.values(data).filter((provider) => provider.id !== 'credentials'),
  })


  if (providers.isLoading) return <Loading />
  return (
    <>
      {providers.data &&
        providers.data.map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      <p>{providers.error ? (providers.error as Error).message : null}</p>
    </>
  )
}

export default OAuthProviders
