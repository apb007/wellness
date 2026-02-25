'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'

export function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [newClassName, setNewClassName] = useState('')

  const handleCreateClass = async () => {
    if (!newClassName) return

    setLoading(true)
    try {
      const response = await fetch('/api/classes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: 'current-user-id',
          organizationId: 'org-id',
          name: newClassName,
          description: '',
        }),
      })

      if (response.ok) {
        const newClass = await response.json()
        setClasses([...classes, newClass])
        setNewClassName('')
      }
    } catch (error) {
      console.error('Error creating class:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Classes</CardTitle>
        <CardDescription>Manage your classes and add students</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Class name"
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
          />
          <Button onClick={handleCreateClass} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid gap-4">
          {classes.map((cls: any) => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle className="text-base">{cls.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {cls.class_members?.length || 0} students
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
