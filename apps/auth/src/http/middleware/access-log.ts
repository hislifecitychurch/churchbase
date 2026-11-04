import type { MiddlewareHandler } from "hono"

export const accessLog: MiddlewareHandler = async (context, next) => {
  const startedAt = performance.now()
  await next()
  console.log(
    JSON.stringify({
      method: context.req.method,
      path: new URL(context.req.url).pathname,
      status: context.res.status,
      durationMs: Math.round(performance.now() - startedAt),
    }),
  )
}
