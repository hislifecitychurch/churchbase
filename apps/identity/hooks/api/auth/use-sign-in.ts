"use client"

import { useMutation } from "@tanstack/react-query"

import { signIn, type SignInInput } from "@/api/auth/client"

export function useSignIn() {
  return useMutation<boolean, Error, SignInInput>({ mutationFn: signIn })
}
