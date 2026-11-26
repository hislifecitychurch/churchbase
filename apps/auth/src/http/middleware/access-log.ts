import { STATUS_CODES } from "node:http"
import { isIPv4 } from "node:net"
import type { MiddlewareHandler } from "hono"

type AccessLogEntry = {
  time: string
  status: number
  durationMs: number
  remoteAddress: string
  method: string
  path: string
  message: string
}

export function formatAccessLog(entry: AccessLogEntry, colorize = false): string {
  const color = entry.status >= 500 ? 31 : entry.status >= 400 ? 33 : entry.status >= 300 ? 36 : 32
  const status = style(String(entry.status).padStart(3), color, colorize)
  const method = style(entry.method, 35, colorize)
  const message = style(entry.message, color, colorize)
  const remoteAddress = normalizeRemoteAddress(entry.remoteAddress)

  return `${entry.time} | ${status} | ${formatDuration(entry.durationMs).padStart(12)} | ${remoteAddress} | ${method} | ${entry.path} | ${message}`
}

export const accessLog: MiddlewareHandler = async (context, next) => {
  const startedAt = performance.now()
  await next()

  const status = context.res.status
  console.log(
    formatAccessLog(
      {
        time: new Date().toTimeString().slice(0, 8),
        status,
        durationMs: performance.now() - startedAt,
        remoteAddress: context.env?.remoteAddress ?? "—",
        method: context.req.method,
        path: new URL(context.req.url).pathname,
        message: STATUS_CODES[status] ?? "Unknown status",
      },
      Boolean(process.stdout.isTTY && process.env.NO_COLOR === undefined),
    ),
  )
}

function normalizeRemoteAddress(address: string): string {
  const mappedIPv4Prefix = "::ffff:"
  if (address.toLowerCase().startsWith(mappedIPv4Prefix)) {
    const ipv4 = address.slice(mappedIPv4Prefix.length)
    if (isIPv4(ipv4)) return ipv4
  }
  return address
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1) return `${(durationMs * 1000).toFixed(3)}µs`
  if (durationMs < 1000) return `${durationMs.toFixed(3)}ms`
  return `${(durationMs / 1000).toFixed(3)}s`
}

function style(value: string, color: number, enabled: boolean): string {
  return enabled ? `\u001b[${color}m${value}\u001b[0m` : value
}
