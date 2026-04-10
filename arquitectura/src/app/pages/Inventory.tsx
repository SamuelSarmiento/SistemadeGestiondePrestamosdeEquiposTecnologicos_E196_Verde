import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';

type EquipmentStatus = 'Disponible' | 'En préstamo' | 'Mantenimiento';

interface Equipment {
  id: string;
  name: string;
  equipmentId: string;
  laboratory: string;
  status: EquipmentStatus;
  model: string;
  serialNumber: string;
}

export function Inventory() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: 'Microscopio Óptico', equipmentId: 'EQ-001', laboratory: 'Laboratorio A', status: 'Disponible', model: 'Olympus CX23', serialNumber: 'SN-2023-001' },
    { id: '2', name: 'Centrífuga', equipmentId: 'EQ-002', laboratory: 'Laboratorio B', status: 'En préstamo', model: 'Eppendorf 5810R', serialNumber: 'SN-2023-002' },
    { id: '3', name: 'Espectrofotómetro', equipmentId: 'EQ-003', laboratory: 'Laboratorio A', status: 'Disponible', model: 'Thermo Scientific', serialNumber: 'SN-2023-003' },
    { id: '4', name: 'Autoclave', equipmentId: 'EQ-004', laboratory: 'Laboratorio C', status: 'Mantenimiento', model: 'Tuttnauer 2540M', serialNumber: 'SN-2023-004' },
    { id: '5', name: 'Balanza Analítica', equipmentId: 'EQ-005', laboratory: 'Laboratorio B', status: 'Disponible', model: 'Mettler Toledo', serialNumber: 'SN-2023-005' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'Todos'>('Todos');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    equipmentId: '',
    laboratory: '',
    model: '',
    serialNumber: '',
  });

  const handleAddEquipment = () => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name: formData.name,
      equipmentId: formData.equipmentId,
      laboratory: formData.laboratory,
      status: 'Disponible',
      model: formData.model,
      serialNumber: formData.serialNumber,
    };
    setEquipment([...equipment, newEquipment]);
    setIsAddOpen(false);
    setFormData({ name: '', equipmentId: '', laboratory: '', model: '', serialNumber: '' });
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.laboratory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En préstamo':
        return 'bg-blue-100 text-blue-800';
      case 'Mantenimiento':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Inventario de Equipos</h2>
        <p className="text-gray-500 mt-1">Gestión completa del inventario de laboratorio</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Listado de Equipos</CardTitle>
              <CardDescription>Gestión de activos del laboratorio</CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Equipo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                  <DialogDescription>Complete la información del equipo</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Equipo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Microscopio Óptico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">ID del Equipo</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                      placeholder="Ej: EQ-006"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="laboratory">Laboratorio</Label>
                    <Input
                      id="laboratory"
                      value={formData.laboratory}
                      onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                      placeholder="Ej: Laboratorio A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Ej: Olympus CX23"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="serialNumber">Número de Serie</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="Ej: SN-2023-006"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddEquipment}>Agregar Equipo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, ID o laboratorio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EquipmentStatus | 'Todos')}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los estados</SelectItem>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En préstamo">En préstamo</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Laboratorio</TableHead>
                  <TableHead>Número de Serie</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.equipmentId}</TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.laboratory}</TableCell>
                      <TableCell>{item.serialNumber}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron equipos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-gray-500">
            Mostrando {filteredEquipment.length} de {equipment.length} equipos
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
