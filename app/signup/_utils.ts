import Helper from "../_utils/helper"
import { SignUpApiResponse, UserSignUpData } from "@/types/types"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

export const signUpUser = async ({ userData, router }: { userData: UserSignUpData, router: AppRouterInstance }) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  
  const { success, data, error }: SignUpApiResponse = await res.json()
  
  if (!res.ok) throw new Error(Helper.sanitizeErrorMessage(error!))
  
  setTimeout(() => router.push('/signin'), 3000)
  
  return data
}
