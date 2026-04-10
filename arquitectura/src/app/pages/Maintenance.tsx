import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, AlertCircle, Wrench, Upload } from 'lucide-react';

type MaintenanceStatus = 'Reportado' | 'En mantenimiento' | 'Reparado' | 'Baja';
type IncidentSeverity = 'Baja' | 'Media' | 'Alta' | 'Crítica';

interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  equipmentId: string;
  issueDescription: string;
  reportedBy: string;
  reportDate: Date;
  status: MaintenanceStatus;
  severity: IncidentSeverity;
  observations?: string;
  evidence?: string;
  resolvedDate?: Date;
}

export function Maintenance() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([
    {
      id: '1',
      equipmentName: 'Autoclave',
      equipmentId: 'EQ-004',
      issueDescription: 'No alcanza la temperatura requerida',
      reportedBy: 'Juan Pérez',
      reportDate: new Date(2026, 3, 8),
      status: 'En mantenimiento',
      severity: 'Alta',
      observations: 'Técnico en revisión del sistema de calentamiento',
    },
    {
      id: '2',
      equipmentName: 'Microscopio Óptico',
      equipmentId: 'EQ-001',
      issueDescription: 'Problema con el enfoque fino',
      reportedBy: 'Ana López',
      reportDate: new Date(2026, 3, 5),
      status: 'Reportado',
      severity: 'Media',
    },
    {
      id: '3',
      equipmentName: 'Centrífuga',
      equipmentId: 'EQ-002',
      issueDescription: 'Ruido excesivo durante operación',
      reportedBy: 'Carlos Ruiz',
      reportDate: new Date(2026, 3, 1),
      status: 'Reparado',
      severity: 'Baja',
      observations: 'Rodamientos reemplazados',
      resolvedDate: new Date(2026, 3, 7),
    },
  ]);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentId: '',
    issueDescription: '',
    severity: 'Media' as IncidentSeverity,
  });
  const [updateData, setUpdateData] = useState({
    status: 'En mantenimiento' as MaintenanceStatus,
    observations: '',
  });

  const handleReportIssue = () => {
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      equipmentName: formData.equipmentName,
      equipmentId: formData.equipmentId,
      issueDescription: formData.issueDescription,
      reportedBy: 'Usuario Actual',
      reportDate: new Date(),
      status: 'Reportado',
      severity: formData.severity,
    };
    setRecords([...records, newRecord]);
    setIsReportOpen(false);
    setFormData({
      equipmentName: '',
      equipmentId: '',
      issueDescription: '',
      severity: 'Media',
    });
  };

  const handleUpdateStatus = () => {
    if (!selectedRecord) return;
    setRecords(records.map(record =>
      record.id === selectedRecord.id
        ? {
            ...record,
            status: updateData.status,
            observations: updateData.observations,
            resolvedDate: updateData.status === 'Reparado' ? new Date() : undefined,
          }
        : record
    ));
    setIsUpdateOpen(false);
    setSelectedRecord(null);
    setUpdateData({ status: 'En mantenimiento', observations: '' });
  };

  const openUpdateDialog = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setUpdateData({
      status: record.status,
      observations: record.observations || '',
    });
    setIsUpdateOpen(true);
  };

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'Baja':
        return 'bg-green-100 text-green-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Crítica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Reportado':
        return 'bg-blue-100 text-blue-800';
      case 'En mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reparado':
        return 'bg-green-100 text-green-800';
      case 'Baja':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeIssues = records.filter(r => r.status === 'Reportado' || r.status === 'En mantenimiento');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Mantenimiento e Incidencias</h2>
        <p className="text-gray-500 mt-1">Gestión de fallos y mantenimiento de equipos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Incidencias</p>
                <p className="text-2xl font-semibold mt-1">{records.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Activas</p>
                <p className="text-2xl font-semibold mt-1">{activeIssues.length}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reparados</p>
                <p className="text-2xl font-semibold mt-1">
                  {records.filter(r => r.status === 'Reparado').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dados de Baja</p>
                <p className="text-2xl font-semibold mt-1">
                  {records.filter(r => r.status === 'Baja').length}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Mantenimiento</CardTitle>
              <CardDescription>Historial de incidencias y reparaciones</CardDescription>
            </div>
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Reportar Fallo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reportar Fallo en Equipo</DialogTitle>
                  <DialogDescription>Complete la información del problema detectado</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentName">Nombre del Equipo</Label>
                    <Input
                      id="equipmentName"
                      value={formData.equipmentName}
                      onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                      placeholder="Ej: Microscopio Óptico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">ID del Equipo</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                      placeholder="Ej: EQ-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severidad</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) => setFormData({ ...formData, severity: value as IncidentSeverity })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issueDescription">Descripción del Problema</Label>
                    <Textarea
                      id="issueDescription"
                      value={formData.issueDescription}
                      onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                      placeholder="Describa el problema detectado..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evidence">Adjuntar Evidencia (Opcional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Haga clic para adjuntar imágenes o archivos</p>
                      <p className="text-xs text-gray-400 mt-1">Máximo 10MB</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReportOpen(false)}>Cancelar</Button>
                  <Button onClick={handleReportIssue}>Reportar Fallo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Reportado Por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.equipmentName}</TableCell>
                  <TableCell>{record.equipmentId}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.issueDescription}</TableCell>
                  <TableCell>{record.reportedBy}</TableCell>
                  <TableCell>
                    {record.reportDate.toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(record.severity)}>
                      {record.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUpdateDialog(record)}
                    >
                      Actualizar Estado
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {records.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay registros de mantenimiento
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Estado de Mantenimiento</DialogTitle>
            <DialogDescription>Cambiar el estado del equipo y agregar observaciones</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Input value={selectedRecord?.equipmentName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Problema Reportado</Label>
              <Textarea value={selectedRecord?.issueDescription || ''} disabled rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Nuevo Estado</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) => setUpdateData({ ...updateData, status: value as MaintenanceStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reportado">Reportado</SelectItem>
                  <SelectItem value="En mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem value="Reparado">Reparado</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-observations">Observaciones</Label>
              <Textarea
                id="update-observations"
                value={updateData.observations}
                onChange={(e) => setUpdateData({ ...updateData, observations: e.target.value })}
                placeholder="Ingrese observaciones sobre el mantenimiento realizado..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateStatus}>Actualizar Estado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
