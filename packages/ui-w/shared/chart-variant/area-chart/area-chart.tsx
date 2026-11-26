"use client"

import * as React from "react"
import {
  Area,
  AreaChart as AreaChartPrimitive,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import type { CurveType } from "recharts/types/shape/Curve"

import type { ChartConfig } from "@packages/ui-w/shared/chart/chart"
import { ChartContainer } from "@packages/ui-w/shared/chart/chart"
import { ChartLegend } from "@packages/ui-w/shared/chart/chart-legend"
import { ChartLegendContent } from "@packages/ui-w/shared/chart/chart-legend-content"
import { ChartTooltip } from "@packages/ui-w/shared/chart/chart-tooltip"
import { ChartTooltipContent } from "@packages/ui-w/shared/chart/chart-tooltip-content"

export type ChartRow = Record<string, string | number | null | undefined>

export type AreaChartSeries = {
  dataKey: string
  fill?: string
  fillOpacity?: number
  stroke?: string
  strokeWidth?: number
  dot?: React.ComponentProps<typeof Area>["dot"]
  activeDot?: React.ComponentProps<typeof Area>["activeDot"]
  label?: React.ComponentProps<typeof Area>["label"]
  type?: CurveType
  connectNulls?: boolean
  stackId?: React.ComponentProps<typeof Area>["stackId"]
  strokeDasharray?: string
  opacity?: number
}

export type AreaChartReferenceLine = {
  y: number
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  strokeOpacity?: number
  label?: React.ComponentProps<typeof ReferenceLine>["label"]
}

export type AreaChartProps<TData extends ChartRow> = {
  data: TData[]
  config: ChartConfig
  series: AreaChartSeries[]
  referenceLines?: AreaChartReferenceLine[]
  xAxisKey: keyof TData | string
  className?: string
  curveType?: CurveType
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  tooltipCursor?: React.ComponentProps<typeof ChartTooltip>["cursor"]
  tooltipIndicator?: "line" | "dot" | "dashed"
  tooltipLabelKey?: string
  tooltipNameKey?: string
  xAxisTickMargin?: number
  xAxisTickFormatter?: (value: TData[keyof TData] | string) => string
  yAxisDomain?: [number, number]
  showYAxis?: boolean
  yAxisLabel?: string
  yAxisWidth?: number
  yAxisTickMargin?: number
  yAxisTickFormatter?: (value: number) => string
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

export function AreaChart<TData extends ChartRow>({
  data,
  config,
  series,
  referenceLines,
  xAxisKey,
  className,
  curveType = "monotone",
  showLegend = false,
  showTooltip = true,
  showGrid = true,
  tooltipCursor = false,
  tooltipIndicator = "dot",
  tooltipLabelKey,
  tooltipNameKey,
  xAxisTickMargin = 8,
  xAxisTickFormatter,
  yAxisDomain,
  showYAxis = false,
  yAxisLabel,
  yAxisWidth = 28,
  yAxisTickMargin = 6,
  yAxisTickFormatter,
  margin = { left: 12, right: 12 },
}: AreaChartProps<TData>): React.ReactElement {
  const gradientId = React.useId().replace(/:/g, "")

  return (
    <ChartContainer config={config} className={className}>
      <AreaChartPrimitive accessibilityLayer data={data} margin={margin}>
        <defs>
          {series.map((item, index) => {
            const color = item.stroke ?? `var(--color-${item.dataKey})`

            return (
              <linearGradient
                id={`${gradientId}-${index}`}
                key={`${item.dataKey}-${index}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            )
          })}
        </defs>
        {showGrid ? <CartesianGrid vertical={false} /> : null}
        <XAxis
          dataKey={xAxisKey as string}
          tickLine={false}
          axisLine={false}
          tickMargin={xAxisTickMargin}
          tickFormatter={
            xAxisTickFormatter
              ? (value) => xAxisTickFormatter(value as TData[keyof TData] | string)
              : undefined
          }
        />
        <YAxis
          hide={!showYAxis}
          domain={yAxisDomain}
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          tickMargin={yAxisTickMargin}
          tickFormatter={yAxisTickFormatter}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "var(--muted-foreground)" },
                }
              : undefined
          }
        />
        {showTooltip ? (
          <ChartTooltip
            cursor={tooltipCursor}
            content={
              <ChartTooltipContent
                indicator={tooltipIndicator}
                labelKey={tooltipLabelKey}
                nameKey={tooltipNameKey}
              />
            }
          />
        ) : null}
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {referenceLines?.map((item, index) => (
          <ReferenceLine
            key={`reference-line-${index}`}
            y={item.y}
            stroke={item.stroke ?? "var(--color-red-500)"}
            strokeWidth={item.strokeWidth ?? 1.5}
            strokeDasharray={item.strokeDasharray ?? "6 4"}
            strokeOpacity={item.strokeOpacity ?? 1}
            label={item.label}
          />
        ))}
        {series.map((item, index) => (
          <Area
            key={item.dataKey}
            dataKey={item.dataKey}
            type={item.type ?? curveType}
            fill={item.fill ?? `url(#${gradientId}-${index})`}
            fillOpacity={item.fillOpacity ?? 0.4}
            stroke={item.stroke ?? `var(--color-${item.dataKey})`}
            strokeWidth={item.strokeWidth ?? 2}
            dot={item.dot ?? false}
            activeDot={item.activeDot ?? true}
            label={item.label}
            connectNulls={item.connectNulls}
            stackId={item.stackId}
            strokeDasharray={item.strokeDasharray}
            opacity={item.opacity}
          />
        ))}
      </AreaChartPrimitive>
    </ChartContainer>
  )
}
