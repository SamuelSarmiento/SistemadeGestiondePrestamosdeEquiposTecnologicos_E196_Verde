import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Users, Building2, Package, TrendingUp, Plus, Edit } from 'lucide-react';
import { UserRole } from '../contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  sede: string;
  status: 'Activo' | 'Inactivo';
}

export function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'María García', username: 'mgarcia', role: 'Coordinador', sede: 'Sede Central', status: 'Activo' },
    { id: '2', name: 'Juan Pérez', username: 'jperez', role: 'Técnico', sede: 'Laboratorio A', status: 'Activo' },
    { id: '3', name: 'Ana López', username: 'alopez', role: 'Solicitante', sede: 'Sede Norte', status: 'Activo' },
    { id: '4', name: 'Carlos Ruiz', username: 'cruiz', role: 'Técnico', sede: 'Laboratorio B', status: 'Inactivo' },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Solicitante' as UserRole,
    sede: '',
  });

  const metrics = [
    { label: 'Total Usuarios', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sedes Activas', value: '12', icon: Building2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Equipos Totales', value: '342', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Uso Mensual', value: '+23%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const handleCreateUser = () => {
    const newUser: UserData = {
      id: Date.now().toString(),
      name: formData.name,
      username: formData.username,
      role: formData.role,
      sede: formData.sede,
      status: 'Activo',
    };
    setUsers([...users, newUser]);
    setIsCreateOpen(false);
    setFormData({ name: '', username: '', role: 'Solicitante', sede: '' });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...formData } : u));
    setEditingUser(null);
    setFormData({ name: '', username: '', role: 'Solicitante', sede: '' });
  };

  const openEditDialog = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      sede: user.sede,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Dashboard de Administrador</h2>
        <p className="text-gray-500 mt-1">Métricas de uso y gestión de usuarios</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <p className="text-2xl font-semibold mt-1">{metric.value}</p>
                  </div>
                  <div className={`${metric.bg} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administrar usuarios, roles y permisos del sistema</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>Complete los datos del nuevo usuario</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ingrese el nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Ingrese el nombre de usuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Coordinador">Coordinador</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                        <SelectItem value="Solicitante">Solicitante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sede">Sede</Label>
                    <Input
                      id="sede"
                      value={formData.sede}
                      onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                      placeholder="Ingrese la sede"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateUser}>Crear Usuario</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.sede}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Activo' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar Permisos
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuario</DialogTitle>
                          <DialogDescription>Modificar datos y permisos del usuario</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nombre Completo</Label>
                            <Input
                              id="edit-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-role">Rol</Label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="Coordinador">Coordinador</SelectItem>
                                <SelectItem value="Técnico">Técnico</SelectItem>
                                <SelectItem value="Solicitante">Solicitante</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-sede">Sede</Label>
                            <Input
                              id="edit-sede"
                              value={formData.sede}
                              onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
                          <Button onClick={handleEditUser}>Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
