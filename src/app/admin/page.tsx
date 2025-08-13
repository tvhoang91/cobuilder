'use client'

import { api } from '@/trpc/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/components/hooks/use-auth'

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const { data: users } = api.user.getAllUsers.useQuery(undefined, {
    enabled: isAdmin,
  })

  const utils = api.useUtils()
  const updateRoleMutation = api.user.updateRole.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate()
    },
  })

  const handleUpdateRole = (id: string, role: 'DESIGNER' | 'GUEST') => {
    if (updateRoleMutation.isPending) return
    updateRoleMutation.mutate({ id, role })
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Administration</h1>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Avatar>
                      <AvatarImage src={user.image || ''} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    {user.name || 'N/A'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(role) => handleUpdateRole(user.id, role as 'DESIGNER' | 'GUEST')}
                      disabled={user.role === 'ADMIN'}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DESIGNER">Designer</SelectItem>
                        <SelectItem value="GUEST">Guest</SelectItem>
                        <SelectItem value="ADMIN" hidden disabled>
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}

              {users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {users === undefined && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
