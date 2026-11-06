import { describe, expect, it } from "bun:test"

import { formatAccessLog } from "../../../../src/http/middleware/access-log"

describe("formatAccessLog", () => {
  it("formats a readable request line", () => {
    expect(
      formatAccessLog(
        {
          time: "17:39:12",
          status: 404,
          durationMs: 0.031916,
          remoteAddress: "::1",
          method: "HEAD",
          path: "/",
          message: "Not Found",
        },
        false,
      ),
    ).toBe("17:39:12 | 404 |     31.916µs | ::1 | HEAD | / | Not Found")
  })

  it("renders IPv4-mapped IPv6 addresses as IPv4", () => {
    const line = formatAccessLog(
      {
        time: "17:39:12",
        status: 404,
        durationMs: 0.5,
        remoteAddress: "::ffff:127.0.0.1",
        method: "HEAD",
        path: "/",
        message: "Not Found",
      },
      false,
    )

    expect(line).toContain("| 127.0.0.1 | HEAD |")
  })

  it("formats longer request durations and colors failures when enabled", () => {
    const line = formatAccessLog(
      {
        time: "17:39:12",
        status: 500,
        durationMs: 1234,
        remoteAddress: "127.0.0.1",
        method: "POST",
        path: "/internal/provision-user",
        message: "Internal Server Error",
      },
      true,
    )

    expect(line).toContain("1.234s")
    expect(line).toContain("\u001b[31m500\u001b[0m")
    expect(line).toContain("\u001b[31mInternal Server Error\u001b[0m")
  })
})
