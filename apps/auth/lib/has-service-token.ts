import { timingSafeEqual } from "node:crypto"

export function hasServiceToken(authorization: string | undefined, expected: string): boolean {
  if (!authorization?.startsWith("Bearer ")) return false

  const received = Buffer.from(authorization.slice("Bearer ".length))
  const expectedBytes = Buffer.from(expected)
  return received.length === expectedBytes.length && timingSafeEqual(received, expectedBytes)
}
