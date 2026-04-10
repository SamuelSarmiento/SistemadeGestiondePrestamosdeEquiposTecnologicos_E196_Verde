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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { Plus, CheckCircle, XCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type LoanStatus = 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Entregado' | 'Devuelto';

interface Loan {
  id: string;
  equipmentName: string;
  equipmentId: string;
  requester: string;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  status: LoanStatus;
  observations?: string;
  approvedBy?: string;
}

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      equipmentName: 'Microscopio Óptico',
      equipmentId: 'EQ-001',
      requester: 'Ana López',
      requestDate: new Date(2026, 3, 5),
      startDate: new Date(2026, 3, 10),
      endDate: new Date(2026, 3, 15),
      status: 'Pendiente',
    },
    {
      id: '2',
      equipmentName: 'Centrífuga',
      equipmentId: 'EQ-002',
      requester: 'Carlos Ruiz',
      requestDate: new Date(2026, 3, 8),
      startDate: new Date(2026, 3, 9),
      endDate: new Date(2026, 3, 12),
      status: 'Aprobado',
      approvedBy: 'María García',
    },
    {
      id: '3',
      equipmentName: 'Espectrofotómetro',
      equipmentId: 'EQ-003',
      requester: 'Luis Martínez',
      requestDate: new Date(2026, 3, 1),
      startDate: new Date(2026, 3, 3),
      endDate: new Date(2026, 3, 8),
      status: 'Devuelto',
      observations: 'Equipo devuelto en buenas condiciones',
    },
  ]);

  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [deliveryObservations, setDeliveryObservations] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleApproveLoan = (loanId: string) => {
    setLoans(loans.map(loan =>
      loan.id === loanId ? { ...loan, status: 'Aprobado' as LoanStatus, approvedBy: 'Coordinador' } : loan
    ));
  };

  const handleRejectLoan = (loanId: string) => {
    setLoans(loans.map(loan =>
      loan.id === loanId ? { ...loan, status: 'Rechazado' as LoanStatus } : loan
    ));
  };

  const handleDelivery = () => {
    if (!selectedLoan) return;
    setLoans(loans.map(loan =>
      loan.id === selectedLoan.id
        ? { ...loan, status: 'Entregado' as LoanStatus, observations: deliveryObservations }
        : loan
    ));
    setIsDeliveryOpen(false);
    setSelectedLoan(null);
    setDeliveryObservations('');
  };

  const handleReturn = () => {
    if (!selectedLoan) return;
    setLoans(loans.map(loan =>
      loan.id === selectedLoan.id
        ? { ...loan, status: 'Devuelto' as LoanStatus, observations: deliveryObservations }
        : loan
    ));
    setIsDeliveryOpen(false);
    setSelectedLoan(null);
    setDeliveryObservations('');
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      case 'Entregado':
        return 'bg-blue-100 text-blue-800';
      case 'Devuelto':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingLoans = loans.filter(l => l.status === 'Pendiente');
  const activeLoans = loans.filter(l => l.status === 'Aprobado' || l.status === 'Entregado');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Gestión de Préstamos</h2>
        <p className="text-gray-500 mt-1">Solicitudes, aprobaciones y control de préstamos</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">
            Solicitudes
            {pendingLoans.length > 0 && (
              <Badge className="ml-2" variant="destructive">{pendingLoans.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Préstamos Activos</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>

        {/* Solicitudes Pendientes */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes</CardTitle>
              <CardDescription>Aprobar o rechazar solicitudes de préstamo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Fecha Solicitud</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.equipmentName}</TableCell>
                      <TableCell>{loan.equipmentId}</TableCell>
                      <TableCell>{loan.requester}</TableCell>
                      <TableCell>{format(loan.requestDate, 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell>
                        {format(loan.startDate, 'dd/MM', { locale: es })} - {format(loan.endDate, 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {loan.status === 'Pendiente' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveLoan(loan.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectLoan(loan.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1 text-red-600" />
                                Rechazar
                              </Button>
                            </>
                          )}
                          {loan.status === 'Aprobado' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedLoan(loan);
                                setIsDeliveryOpen(true);
                              }}
                            >
                              Registrar Entrega
                            </Button>
                          )}
                          {loan.status === 'Entregado' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedLoan(loan);
                                setIsDeliveryOpen(true);
                              }}
                            >
                              Registrar Devolución
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay solicitudes de préstamo
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Préstamos Activos */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Préstamos Activos</CardTitle>
              <CardDescription>Equipos actualmente en préstamo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Fecha Entrega</TableHead>
                    <TableHead>Fecha Devolución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.equipmentName}</TableCell>
                      <TableCell>{loan.requester}</TableCell>
                      <TableCell>{format(loan.startDate, 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell>{format(loan.endDate, 'dd/MM/yyyy', { locale: es })}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{loan.observations || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {activeLoans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay préstamos activos
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendario */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendario de Reservas</CardTitle>
              <CardDescription>Vista de préstamos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-4">
                    Préstamos para {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: es }) : 'Seleccione una fecha'}
                  </h3>
                  <div className="space-y-3">
                    {selectedDate && loans
                      .filter(loan => 
                        selectedDate >= loan.startDate && selectedDate <= loan.endDate
                      )
                      .map(loan => (
                        <div key={loan.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{loan.equipmentName}</p>
                              <p className="text-sm text-gray-500">{loan.requester}</p>
                              <p className="text-sm text-gray-500">
                                {format(loan.startDate, 'dd/MM', { locale: es })} - {format(loan.endDate, 'dd/MM/yyyy', { locale: es })}
                              </p>
                            </div>
                            <Badge className={getStatusColor(loan.status)}>
                              {loan.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {selectedDate && loans.filter(loan => 
                      selectedDate >= loan.startDate && selectedDate <= loan.endDate
                    ).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No hay préstamos programados para esta fecha
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delivery/Return Dialog */}
      <Dialog open={isDeliveryOpen} onOpenChange={setIsDeliveryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedLoan?.status === 'Aprobado' ? 'Registrar Entrega' : 'Registrar Devolución'}
            </DialogTitle>
            <DialogDescription>
              Complete la información de {selectedLoan?.status === 'Aprobado' ? 'entrega' : 'devolución'} del equipo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Input value={selectedLoan?.equipmentName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Solicitante</Label>
              <Input value={selectedLoan?.requester || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={deliveryObservations}
                onChange={(e) => setDeliveryObservations(e.target.value)}
                placeholder="Ingrese observaciones sobre el estado del equipo..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliveryOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={selectedLoan?.status === 'Aprobado' ? handleDelivery : handleReturn}>
              Confirmar {selectedLoan?.status === 'Aprobado' ? 'Entrega' : 'Devolución'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
