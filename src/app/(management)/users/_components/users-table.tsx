'use client'

import { api } from '@/trpc/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { RouterOutputs } from '@/trpc/react'

type User = RouterOutputs['user']['getAllUsers'][0]

interface UsersTableProps {
  initialUsers: User[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const { data: users = initialUsers } = api.user.getAllUsers.useQuery(undefined, {
    initialData: initialUsers,
    refetchOnMount: false,
  })

  const utils = api.useUtils()
  const updateRoleMutation = api.user.updateRole.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate()
    },
  })

  const handleUpdateRole = (id: string, role: 'DESIGNER' | 'GUEST') => {
    if (updateRoleMutation.isPending) return
    updateRoleMutation.mutate({ id, role })
  }

  return (
    <Card>
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
            {users.map((user) => (
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
                    disabled={user.role === 'ADMIN' || updateRoleMutation.isPending}
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

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
