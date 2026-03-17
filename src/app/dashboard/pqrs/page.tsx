"use client";

/**
 * ============================================
 * GESTIÓN DE PQRS
 * Lista y creación de PQRS
 * ============================================
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Eye,
  Edit,
  Trash2,
  X,
  Brain,
  User,
  Calendar,
  Tag,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore, apiRequest, formatDate, formatDateTime } from '@/lib/store';
import Footer from '@/components/layout/Footer';

interface Pqrs {
  id: string;
  radicado: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  categoriaIA?: string;
  confianzaIA?: number;
  sentimientoIA?: string;
  nombreCiudadano: string;
  emailCiudadano?: string;
  telefonoCiudadano?: string;
  fechaRecepcion: string;
  fechaLimite?: string;
  categoria?: { nombre: string; color: string };
  asignado?: { nombre: string; email: string };
  seguimientos?: Array<{
    id: string;
    descripcion: string;
    tipo: string;
    createdAt: string;
    usuario: { nombre: string };
  }>;
  createdAt: string;
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
}

const TIPOS_PQRS = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECLAMO', label: 'Reclamo' },
  { value: 'SUGERENCIA', label: 'Sugerencia' },
  { value: 'DENUNCIA', label: 'Denuncia' },
  { value: 'FELICITACION', label: 'Felicitación' },
];

const ESTADOS = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'ASIGNADO', label: 'Asignado' },
  { value: 'EN_PROCESO', label: 'En Proceso' },
  { value: 'ESPERA_INFO', label: 'Espera Información' },
  { value: 'RESUELTO', label: 'Resuelto' },
  { value: 'CERRADO', label: 'Cerrado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

const PRIORIDADES = [
  { value: 'BAJA', label: 'Baja' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'URGENCIA', label: 'Urgencia' },
];

export default function PqrsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pqrsId = searchParams.get('id');
  
  const { token, isAuthenticated, subscription, logout } = useAuthStore();
  const [pqrsList, setPqrsList] = useState<Pqrs[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');
  
  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPqrs, setSelectedPqrs] = useState<Pqrs | null>(null);
  const [creating, setCreating] = useState(false);
  
  // New PQRS form
  const [formData, setFormData] = useState({
    tipo: 'PETICION',
    titulo: '',
    descripcion: '',
    nombreCiudadano: '',
    emailCiudadano: '',
    telefonoCiudadano: '',
    direccionCiudadano: '',
    categoriaId: '',
  });

  // Check subscription
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
      return;
    }
    
    if (subscription && !subscription.isValid) {
      setError('Su suscripción ha expirado. Actualice su plan para continuar.');
    }
  }, [token, isAuthenticated, subscription, router]);

  // Fetch PQRS list
  const fetchPqrs = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (estadoFilter) params.append('estado', estadoFilter);
      if (tipoFilter) params.append('tipo', tipoFilter);
      if (search) params.append('busqueda', search);
      
      const response = await apiRequest(`/pqrs?${params.toString()}`, {}, token);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          router.push('/');
          return;
        }
        if (response.status === 402) {
          setError(data.error);
          return;
        }
        throw new Error(data.error || 'Error al cargar PQRS');
      }
      
      setPqrsList(data.pqrs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [token, estadoFilter, tipoFilter, search, logout, router]);

  // Fetch categories
  const fetchCategorias = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await apiRequest('/categorias', {}, token);
      const data = await response.json();
      setCategorias(data.categorias);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [token]);

  // Fetch single PQRS detail
  const fetchPqrsDetail = useCallback(async (id: string) => {
    if (!token) return;
    
    try {
      const response = await apiRequest(`/pqrs/${id}`, {}, token);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar PQRS');
      }
      
      setSelectedPqrs(data.pqrs);
      setShowDetail(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [token]);

  useEffect(() => {
    fetchPqrs();
    fetchCategorias();
  }, [fetchPqrs, fetchCategorias]);

  useEffect(() => {
    if (pqrsId) {
      fetchPqrsDetail(pqrsId);
    }
  }, [pqrsId, fetchPqrsDetail]);

  const handleCreatePqrs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setCreating(true);
    setError(null);
    
    try {
      const response = await apiRequest('/pqrs', {
        method: 'POST',
        body: JSON.stringify(formData),
      }, token);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear PQRS');
      }
      
      setShowCreate(false);
      setFormData({
        tipo: 'PETICION',
        titulo: '',
        descripcion: '',
        nombreCiudadano: '',
        emailCiudadano: '',
        telefonoCiudadano: '',
        direccionCiudadano: '',
        categoriaId: '',
      });
      fetchPqrs();
      
      // Show detail of new PQRS
      setSelectedPqrs(data.pqrs);
      setShowDetail(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    if (!token) return;
    
    try {
      const response = await apiRequest(`/pqrs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado }),
      }, token);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar');
      }
      
      fetchPqrs();
      if (selectedPqrs?.id === id) {
        fetchPqrsDetail(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ASIGNADO: 'bg-blue-100 text-blue-800 border-blue-200',
      EN_PROCESO: 'bg-purple-100 text-purple-800 border-purple-200',
      ESPERA_INFO: 'bg-orange-100 text-orange-800 border-orange-200',
      RESUELTO: 'bg-green-100 text-green-800 border-green-200',
      CERRADO: 'bg-gray-100 text-gray-800 border-gray-200',
      RECHAZADO: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      BAJA: 'bg-slate-100 text-slate-700',
      MEDIA: 'bg-blue-100 text-blue-700',
      ALTA: 'bg-orange-100 text-orange-700',
      URGENCIA: 'bg-red-100 text-red-700',
    };
    return colors[prioridad] || 'bg-gray-100 text-gray-700';
  };

  const getSentimientoColor = (sentimiento: string) => {
    const colors: Record<string, string> = {
      POSITIVO: 'text-green-600',
      NEUTRO: 'text-slate-600',
      NEGATIVO: 'text-orange-600',
      MUY_NEGATIVO: 'text-red-600',
    };
    return colors[sentimiento] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Dashboard
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <h1 className="font-semibold text-lg">Gestión de PQRS</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {subscription && subscription.daysRemaining <= 7 && subscription.planType === 'TRIAL' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {subscription.daysRemaining} días de prueba
                </Badge>
              )}
              
              <Button 
                onClick={() => setShowCreate(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={subscription && !subscription.isValid}
              >
                <Plus className="mr-2 w-4 h-4" />
                Nueva PQRS
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                {error}
                {error.includes('suscripción') && (
                  <Button size="sm" onClick={() => router.push('/dashboard/pricing')}>
                    Ver Planes
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por radicado, título, ciudadano..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {TIPOS_PQRS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* PQRS List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : pqrsList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No hay PQRS registradas</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera PQRS para comenzar a gestionar
                </p>
                <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 w-4 h-4" />
                  Crear Primera PQRS
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pqrsList.map((pqrs) => (
                <motion.div
                  key={pqrs.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => fetchPqrsDetail(pqrs.id)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-mono text-sm text-muted-foreground">
                              {pqrs.radicado}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {pqrs.tipo}
                            </Badge>
                            <Badge className={getEstadoColor(pqrs.estado)}>
                              {pqrs.estado}
                            </Badge>
                            <Badge className={getPrioridadColor(pqrs.prioridad)}>
                              {pqrs.prioridad}
                            </Badge>
                            {pqrs.categoria && (
                              <Badge 
                                style={{ backgroundColor: pqrs.categoria.color + '20', color: pqrs.categoria.color }}
                              >
                                {pqrs.categoria.nombre}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-1 truncate">
                            {pqrs.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {pqrs.descripcion}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {pqrs.nombreCiudadano}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(pqrs.createdAt)}
                            </span>
                            {pqrs.categoriaIA && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <Brain className="w-3 h-3" />
                                IA: {pqrs.categoriaIA}
                              </span>
                            )}
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create PQRS Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva PQRS</DialogTitle>
            <DialogDescription>
              Registre una nueva Peticion, Queja, Reclamo o Sugerencia
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreatePqrs} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(v) => setFormData({ ...formData, tipo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PQRS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select 
                  value={formData.categoriaId} 
                  onValueChange={(v) => setFormData({ ...formData, categoriaId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Asunto de la PQRS"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describa detalladamente el caso..."
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                💡 La IA analizará el texto para sugerir clasificación y prioridad
              </p>
            </div>

            <Separator />

            <h4 className="font-medium">Datos del Ciudadano</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreCiudadano">Nombre Completo *</Label>
                <Input
                  id="nombreCiudadano"
                  placeholder="Juan Pérez"
                  value={formData.nombreCiudadano}
                  onChange={(e) => setFormData({ ...formData, nombreCiudadano: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailCiudadano">Email</Label>
                <Input
                  id="emailCiudadano"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.emailCiudadano}
                  onChange={(e) => setFormData({ ...formData, emailCiudadano: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefonoCiudadano">Teléfono</Label>
                <Input
                  id="telefonoCiudadano"
                  placeholder="3123456789"
                  value={formData.telefonoCiudadano}
                  onChange={(e) => setFormData({ ...formData, telefonoCiudadano: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccionCiudadano">Dirección</Label>
                <Input
                  id="direccionCiudadano"
                  placeholder="Calle 10 # 5-20"
                  value={formData.direccionCiudadano}
                  onChange={(e) => setFormData({ ...formData, direccionCiudadano: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Radicar PQRS
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* PQRS Detail Sheet */}
      <Sheet open={showDetail} onOpenChange={setShowDetail}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedPqrs && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedPqrs.radicado}</Badge>
                  <Badge className={getEstadoColor(selectedPqrs.estado)}>
                    {selectedPqrs.estado}
                  </Badge>
                </div>
                <SheetTitle className="text-left">{selectedPqrs.titulo}</SheetTitle>
                <SheetDescription className="text-left">
                  {selectedPqrs.tipo} • Radicada el {formatDateTime(selectedPqrs.createdAt)}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* AI Classification */}
                {selectedPqrs.categoriaIA && (
                  <Alert className="bg-emerald-50 border-emerald-200">
                    <Brain className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-800">Clasificación IA</AlertTitle>
                    <AlertDescription className="text-emerald-700">
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Categoría: {selectedPqrs.categoriaIA}</Badge>
                        <Badge variant="outline">
                          Confianza: {selectedPqrs.confianzaIA ? Math.round(selectedPqrs.confianzaIA * 100) : 0}%
                        </Badge>
                        {selectedPqrs.sentimientoIA && (
                          <Badge variant="outline" className={getSentimientoColor(selectedPqrs.sentimientoIA)}>
                            Sentimiento: {selectedPqrs.sentimientoIA}
                          </Badge>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Descripción</Label>
                    <p className="mt-1 text-slate-700">{selectedPqrs.descripcion}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Prioridad</Label>
                      <div className="mt-1">
                        <Badge className={getPrioridadColor(selectedPqrs.prioridad)}>
                          {selectedPqrs.prioridad}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Fecha Límite</Label>
                      <p className="mt-1 text-slate-700">
                        {selectedPqrs.fechaLimite ? formatDate(selectedPqrs.fechaLimite) : 'No definida'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground">Ciudadano</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>{selectedPqrs.nombreCiudadano}</strong></p>
                      {selectedPqrs.emailCiudadano && <p>{selectedPqrs.emailCiudadano}</p>}
                      {selectedPqrs.telefonoCiudadano && <p>{selectedPqrs.telefonoCiudadano}</p>}
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cambiar Estado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={(v) => handleUpdateEstado(selectedPqrs.id, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nuevo estado..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Timeline */}
                {selectedPqrs.seguimientos && selectedPqrs.seguimientos.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Historial de Seguimiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="space-y-4">
                          {selectedPqrs.seguimientos.map((s) => (
                            <div key={s.id} className="flex gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                              <div>
                                <p className="text-sm">{s.descripcion}</p>
                                <p className="text-xs text-muted-foreground">
                                  {s.usuario.nombre} • {formatDateTime(s.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}
