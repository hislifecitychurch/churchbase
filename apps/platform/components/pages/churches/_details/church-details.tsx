"use client"

import type * as React from "react"

import { useChurches } from "@/hooks/api/churches/use-churches"

import { Button } from "@packages/ui-w/shared/button/button"

import { BackToChurchesButton } from "@/components/pages/churches/[churchId]/_button/back-to-churches-button"
import { ChurchLocationForm } from "@/components/pages/churches/_details/_form/church-location-form"
import { PageHeader } from "@/components/shared/_header/page-header"

function ChurchDetail({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  )
}

export function ChurchDetails({ churchId }: { churchId: string }): React.ReactElement {
  const churches = useChurches()
  const church = churches.data?.find((item) => item.id === churchId)

  if (churches.isPending && !churches.data) {
    return (
      <section className="flex flex-col gap-6">
        <BackToChurchesButton />
        <p className="text-muted-foreground" role="status">
          Loading church details…
        </p>
      </section>
    )
  }

  if (churches.isError && !churches.data) {
    return (
      <section className="flex flex-col items-start gap-4">
        <BackToChurchesButton />
        <p className="text-destructive" role="alert">
          We couldn't load this church.
        </p>
        <Button onClick={() => void churches.refetch()} size="lg" type="button" variant="outline">
          Try again
        </Button>
      </section>
    )
  }

  if (!church) {
    return (
      <section className="flex flex-col items-start gap-4">
        <BackToChurchesButton />
        <p className="text-muted-foreground">Church not found.</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <BackToChurchesButton />
      <PageHeader description="Church details" title={church.name} />
      <dl className="bg-card grid gap-x-8 gap-y-6 rounded-xl border p-6 sm:grid-cols-2">
        <ChurchDetail label="Slug">{church.slug}</ChurchDetail>
        <ChurchDetail label="Active members">
          {church.active_member_count.toLocaleString()}
        </ChurchDetail>
        <ChurchDetail label="City">{church.city || "Not provided"}</ChurchDetail>
        <ChurchDetail label="State or province">
          {church.state_or_province || "Not provided"}
        </ChurchDetail>
        <ChurchDetail label="Country code">{church.country_code || "Not provided"}</ChurchDetail>
        <ChurchDetail label="Time zone">{church.timezone || "Not provided"}</ChurchDetail>
        <ChurchDetail label="Website">
          {church.website ? (
            <a
              className="text-primary break-all hover:underline"
              href={church.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              {church.website}
            </a>
          ) : (
            "Not provided"
          )}
        </ChurchDetail>
        <ChurchDetail label="About this church">{church.bio || "Not provided"}</ChurchDetail>
      </dl>
      <ChurchLocationForm church={church} />
    </section>
  )
}
