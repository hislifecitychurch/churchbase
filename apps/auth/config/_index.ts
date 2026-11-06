import { loadApplicationConfig } from "./app"
import { loadBetterAuthConfig } from "./better-auth"
import { loadCorsConfig } from "./cors"
import { loadDatabaseConfig } from "./db"

const application = loadApplicationConfig()
const betterAuth = loadBetterAuthConfig()
const cors = loadCorsConfig()
const database = loadDatabaseConfig()

if (betterAuth.cookieDomain) {
  const cookieDomain = betterAuth.cookieDomain.replace(/^\./, "")
  const includesOriginOutsideCookieDomain = cors.allowedOrigins.some((origin) => {
    const hostname = new URL(origin).hostname
    return hostname !== cookieDomain && !hostname.endsWith(`.${cookieDomain}`)
  })
  if (includesOriginOutsideCookieDomain) {
    throw new Error("BETTER_AUTH_COOKIE_DOMAIN must cover every allowed browser origin")
  }
}

export const config = {
  application,
  betterAuth,
  cors,
  database,
}
