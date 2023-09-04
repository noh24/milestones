import { useQuery } from '@tanstack/react-query'
import { getProviders, signIn } from 'next-auth/react'

const useQueryProviders = () => {
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

  return providers
}

export default useQueryProviders
