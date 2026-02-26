'use client'

import { AnalyticsCharts } from '@/components/analytics-charts'

export default function AnalyticsPage() {
  // In a real app, this would get the organization ID from session/context
  const organizationId = 'default-org'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="mt-2 text-muted-foreground">
          View comprehensive wellness data and trends across your organization.
        </p>
      </div>

      <AnalyticsCharts organizationId={organizationId} />
    </div>
  )
}
