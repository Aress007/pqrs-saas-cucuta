'use client';

/**
 * ============================================
 * MODAL DE AUTENTICACIÓN
 * Login y Registro de empresas
 * ============================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuthStore, apiRequest } from '@/lib/store';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ open, onClose, initialMode = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setAuth = useAuthStore((state) => state.setAuth);

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    empresa: {
      nombre: '',
      nit: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: 'Cúcuta',
    },
    usuario: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      setAuth({
        usuario: data.usuario,
        empresa: data.empresa,
        subscription: data.subscription,
        token: data.token,
      });

      onClose();
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (registerData.usuario.password !== registerData.usuario.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (registerData.usuario.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          empresa: registerData.empresa,
          usuario: {
            nombre: registerData.usuario.nombre,
            apellido: registerData.usuario.apellido,
            email: registerData.usuario.email,
            password: registerData.usuario.password,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setAuth({
        usuario: data.usuario,
        empresa: data.empresa,
        subscription: data.subscription,
        token: data.token,
      });

      onClose();
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {activeTab === 'login' ? 'Iniciar Sesión' : 'Registrar Empresa'}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'login' 
              ? 'Ingresa a tu cuenta para gestionar tus PQRS'
              : 'Crea tu cuenta y disfruta de 30 días gratis'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'login' | 'register'); setError(null); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Datos de Empresa */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Datos de la Empresa
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="empresa-nombre">Nombre *</Label>
                    <Input
                      id="empresa-nombre"
                      placeholder="Mi Microempresa"
                      value={registerData.empresa.nombre}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        empresa: { ...registerData.empresa, nombre: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa-nit">NIT *</Label>
                    <Input
                      id="empresa-nit"
                      placeholder="900123456-7"
                      value={registerData.empresa.nit}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        empresa: { ...registerData.empresa, nit: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa-email">Email Empresa *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="empresa-email"
                      type="email"
                      placeholder="empresa@email.com"
                      className="pl-10"
                      value={registerData.empresa.email}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        empresa: { ...registerData.empresa, email: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="empresa-telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="empresa-telefono"
                        placeholder="3123456789"
                        className="pl-10"
                        value={registerData.empresa.telefono}
                        onChange={(e) => setRegisterData({
                          ...registerData,
                          empresa: { ...registerData.empresa, telefono: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa-ciudad">Ciudad</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="empresa-ciudad"
                        placeholder="Cúcuta"
                        className="pl-10"
                        value={registerData.empresa.ciudad}
                        onChange={(e) => setRegisterData({
                          ...registerData,
                          empresa: { ...registerData.empresa, ciudad: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos del Usuario Administrador */}
              <div className="space-y-3 pt-2 border-t">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Datos del Administrador
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="usuario-nombre">Nombre *</Label>
                    <Input
                      id="usuario-nombre"
                      placeholder="Juan"
                      value={registerData.usuario.nombre}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        usuario: { ...registerData.usuario, nombre: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usuario-apellido">Apellido</Label>
                    <Input
                      id="usuario-apellido"
                      placeholder="Pérez"
                      value={registerData.usuario.apellido}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        usuario: { ...registerData.usuario, apellido: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuario-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="usuario-email"
                      type="email"
                      placeholder="admin@email.com"
                      className="pl-10"
                      value={registerData.usuario.email}
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        usuario: { ...registerData.usuario, email: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="usuario-password">Contraseña *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="usuario-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.usuario.password}
                        onChange={(e) => setRegisterData({
                          ...registerData,
                          usuario: { ...registerData.usuario, password: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usuario-confirm">Confirmar *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="usuario-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.usuario.confirmPassword}
                        onChange={(e) => setRegisterData({
                          ...registerData,
                          usuario: { ...registerData.usuario, confirmPassword: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Empresa (30 días gratis)
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
