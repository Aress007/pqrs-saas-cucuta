"use client";


/**
 * ============================================
 * DASHBOARD PRINCIPAL
 * Panel de control con estadísticas y estado de suscripción
 * ============================================
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Bell,
  LogOut,
  Settings,
  User,
  Building2,
  Plus,
  FileText,
  ArrowRight,
  Loader2,
  X,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore, apiRequest, formatDate, formatDateTime } from '@/lib/store';
import Footer from '@/components/layout/Footer';

interface Stats {
  total: number;
  pendientes: number;
  enProceso: number;
  resueltos: number;
  cerrados: number;
  tiempoPromedioRespuesta: number;
  proximasVencer: number;
}

interface PqrsRecent {
  id: string;
  radicado: string;
  titulo: string;
  tipo: string;
  estado: string;
  prioridad: string;
  createdAt: string;
  nombreCiudadano: string;
}

interface DashboardData {
  estadisticas: Stats;
  porTipo: Array<{ tipo: string; cantidad: number }>;
  porPrioridad: Array<{ prioridad: string; cantidad: number }>;
  recientes: PqrsRecent[];
  subscription: {
    isValid: boolean;
    daysRemaining: number;
    planType: string;
    message: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { usuario, empresa, subscription, token, logout, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiRequest('/pqrs/stats', {}, token);
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            router.push('/');
            return;
          }
          throw new Error(result.error || 'Error al cargar datos');
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated, router, logout]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ASIGNADO: 'bg-blue-100 text-blue-800',
      EN_PROCESO: 'bg-purple-100 text-purple-800',
      ESPERA_INFO: 'bg-orange-100 text-orange-800',
      RESUELTO: 'bg-green-100 text-green-800',
      CERRADO: 'bg-gray-100 text-gray-800',
      RECHAZADO: 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      BAJA: 'bg-slate-100 text-slate-800',
      MEDIA: 'bg-blue-100 text-blue-800',
      ALTA: 'bg-orange-100 text-orange-800',
      URGENCIA: 'bg-red-100 text-red-800',
    };
    return colors[prioridad] || 'bg-gray-100 text-gray-800';
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'TRIAL':
        return <Badge className="bg-yellow-500">Prueba Gratuita</Badge>;
      case 'MICRO':
        return <Badge className="bg-emerald-500">Plan Micro</Badge>;
      case 'ENTERPRISE':
        return <Badge className="bg-purple-500">Plan Empresarial</Badge>;
      default:
        return <Badge variant="secondary">{planType}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">PQRS Inteligente</h1>
                <p className="text-xs text-slate-500">{empresa?.nombre}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Trial Warning */}
              {subscription && !subscription.isValid && (
                <Alert variant="destructive" className="hidden md:flex py-2 px-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ¡Suscripción expirada! <Button variant="link" size="sm" onClick={() => router.push('/dashboard/pricing')}>Actualizar plan</Button>
                  </AlertDescription>
                </Alert>
              )}

              {subscription && subscription.isValid && subscription.planType === 'TRIAL' && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Te quedan <strong>{subscription.daysRemaining} días</strong> de prueba
                  </span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-yellow-700"
                    onClick={() => router.push('/dashboard/pricing')}
                  >
                    Ver planes
                  </Button>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="hidden md:inline">{usuario?.nombre}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p>{usuario?.nombre} {usuario?.apellido}</p>
                      <p className="text-xs text-muted-foreground">{usuario?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/pricing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Mi Suscripción
                    {getPlanBadge(subscription?.planType || 'TRIAL')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Trial Banner */}
          {subscription && subscription.isValid && subscription.planType === 'TRIAL' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800">
                        Período de Prueba: {subscription.daysRemaining} días restantes
                      </h3>
                      <p className="text-sm text-yellow-600">
                        Actualiza tu plan para continuar usando todas las funcionalidades
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => router.push('/dashboard/pricing')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Ver Planes
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total PQRS</p>
                      <p className="text-3xl font-bold">{data?.estadisticas.total || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                      <p className="text-3xl font-bold text-yellow-600">{data?.estadisticas.pendientes || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resueltos</p>
                      <p className="text-3xl font-bold text-green-600">{data?.estadisticas.resueltos || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próx. a Vencer</p>
                      <p className="text-3xl font-bold text-red-600">{data?.estadisticas.proximasVencer || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions + Recent PQRS */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Gestiona tus PQRS rápidamente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push('/dashboard/pqrs')}
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Nueva PQRS
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard/pqrs')}
                  >
                    <FileText className="mr-2 w-4 h-4" />
                    Ver Todas las PQRS
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard/pricing')}
                  >
                    <CreditCard className="mr-2 w-4 h-4" />
                    Mi Suscripción
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent PQRS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>PQRS Recientes</CardTitle>
                    <CardDescription>Últimas radicaciones</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/pqrs')}>
                    Ver todas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {data?.recientes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No hay PQRS registradas</p>
                      <Button 
                        className="mt-4"
                        onClick={() => router.push('/dashboard/pqrs')}
                      >
                        <Plus className="mr-2 w-4 h-4" />
                        Crear Primera PQRS
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data?.recientes.map((pqrs) => (
                        <div 
                          key={pqrs.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/dashboard/pqrs?id=${pqrs.id}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-muted-foreground">
                                {pqrs.radicado}
                              </span>
                              <Badge className={getEstadoColor(pqrs.estado)} variant="secondary">
                                {pqrs.estado}
                              </Badge>
                              <Badge className={getPrioridadColor(pqrs.prioridad)} variant="secondary">
                                {pqrs.prioridad}
                              </Badge>
                            </div>
                            <p className="font-medium text-sm truncate">{pqrs.titulo}</p>
                            <p className="text-xs text-muted-foreground">
                              {pqrs.nombreCiudadano} • {formatDate(pqrs.createdAt)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Stats by Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>PQRS por Tipo</CardTitle>
                <CardDescription>Distribución por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {data?.porTipo.map((item) => (
                    <div key={item.tipo} className="text-center p-3 rounded-lg bg-slate-50">
                      <p className="text-2xl font-bold text-slate-900">{item.cantidad}</p>
                      <p className="text-sm text-muted-foreground">{item.tipo}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
