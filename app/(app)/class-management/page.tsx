'use client'

import { ClassManagement } from '@/components/class-management'

export default function ClassManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage your classes, add students, and track their progress.
        </p>
      </div>

      <ClassManagement />
    </div>
  )
}
