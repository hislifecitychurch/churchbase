"use client"

import type * as React from "react"

import {
  AreaChart,
  type AreaChartProps,
  type AreaChartSeries,
  type ChartRow,
} from "@packages/ui-w/shared/chart-variant/area-chart/area-chart"

export type AreaChartStepSeries = AreaChartSeries
export type AreaChartStepProps<TData extends ChartRow> = Omit<AreaChartProps<TData>, "curveType">

export function AreaChartStep<TData extends ChartRow>(
  props: AreaChartStepProps<TData>,
): React.ReactElement {
  return <AreaChart {...props} curveType="stepAfter" />
}
