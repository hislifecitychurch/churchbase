"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart as LineChartPrimitive,
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

export type LineChartSeries = {
  dataKey: string
  stroke?: string
  strokeWidth?: number
  dot?: React.ComponentProps<typeof Line>["dot"]
  activeDot?: React.ComponentProps<typeof Line>["activeDot"]
  type?: CurveType
  connectNulls?: boolean
  strokeDasharray?: string
  opacity?: number
}

export type LineChartReferenceLine = {
  y: number
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  strokeOpacity?: number
  label?: React.ComponentProps<typeof ReferenceLine>["label"]
}

export type LineChartProps<TData extends ChartRow> = {
  data: TData[]
  config: ChartConfig
  series: LineChartSeries[]
  referenceLines?: LineChartReferenceLine[]
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

export function LineChart<TData extends ChartRow>({
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
}: LineChartProps<TData>): React.ReactElement {
  return (
    <ChartContainer config={config} className={className}>
      <LineChartPrimitive accessibilityLayer data={data} margin={margin}>
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
        {series.map((item) => (
          <Line
            key={item.dataKey}
            dataKey={item.dataKey}
            type={item.type ?? curveType}
            stroke={item.stroke ?? `var(--color-${item.dataKey})`}
            strokeWidth={item.strokeWidth ?? 2}
            dot={item.dot ?? false}
            activeDot={item.activeDot ?? true}
            connectNulls={item.connectNulls}
            strokeDasharray={item.strokeDasharray}
            opacity={item.opacity}
          />
        ))}
      </LineChartPrimitive>
    </ChartContainer>
  )
}
