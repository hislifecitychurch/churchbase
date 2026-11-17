import type * as React from "react"

type PageHeaderProps = {
  title: string
  description: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps): React.ReactElement {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="text-foreground text-2xl font-medium">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {actions}
    </header>
  )
}
