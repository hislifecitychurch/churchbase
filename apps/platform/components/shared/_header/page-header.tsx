import type * as React from "react"

type PageHeaderProps = {
  title: string
  description: React.ReactNode
}

export function PageHeader({ title, description }: PageHeaderProps): React.ReactElement {
  return (
    <header className="flex flex-col">
      <h1 className="text-foreground text-2xl font-medium">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </header>
  )
}
