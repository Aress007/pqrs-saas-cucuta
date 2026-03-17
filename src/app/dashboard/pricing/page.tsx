"use client";


/**
 * ============================================
 * PÁGINA DE PRECIOS Y SUSCRIPCIÓN
 * ============================================
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  CreditCard,
  Loader2,
  ArrowLeft,
  Shield,
  Clock,
  HeadphonesIcon,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore, apiRequest, formatCurrency } from '@/lib/store';
import Footer from '@/components/layout/Footer';

interface PlanInfo {
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export default function PricingPage() {
  const router = useRouter();
  const { usuario, empresa, subscription, token, isAuthenticated, updateSubscription } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [plans, setPlans] = useState<Record<string, PlanInfo>>({});
  const [currentSubscription, setCurrentSubscription] = useState(subscription);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await apiRequest('/subscription', {}, token);
        const data = await response.json();
        setPlans(data.plans);
        setCurrentSubscription(data.subscription);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };

    fetchPlans();
  }, [token, isAuthenticated, router]);

  const handleSelectPlan = async (planType: 'MICRO' | 'ENTERPRISE') => {
    if (planType === 'TRIAL') return;
    
    setLoading(planType);
    setError(null);

    try {
      const response = await apiRequest('/subscription', {
        method: 'POST',
        body: JSON.stringify({ planType }),
      }, token!);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar plan');
      }

      updateSubscription(data.subscription);
      setCurrentSubscription(data.subscription);
      
      // Mostrar éxito brevemente y redirigir
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(null);
    }
  };

  const planCards = [
    {
      planType: 'TRIAL',
      name: 'Prueba Gratuita',
      price: 0,
      period: '30 días',
      description: 'Conoce la plataforma sin compromiso',
      features: [
        'Hasta 50 PQRS',
        'Clasificación IA básica',
        'Dashboard básico',
        'Soporte por email',
      ],
      popular: false,
      buttonText: 'Plan Actual',
      disabled: true,
    },
    {
      planType: 'MICRO',
      name: 'Plan Micro',
      price: 49900,
      period: '/mes',
      description: 'Ideal para microempresas',
      features: [
        'PQRS ilimitadas',
        'Clasificación IA avanzada',
        'Reportes completos',
        'Usuarios ilimitados',
        'Soporte prioritario',
        'Recordatorios automáticos',
        'Exportar a Excel',
      ],
      popular: true,
      buttonText: 'Elegir Plan Micro',
      disabled: false,
    },
    {
      planType: 'ENTERPRISE',
      name: 'Plan Empresarial',
      price: 149900,
      period: '/mes',
      description: 'Para empresas en crecimiento',
      features: [
        'Todo lo del Plan Micro',
        'API REST completa',
        'Integraciones personalizadas',
        'Soporte 24/7',
        'Capacitación incluida',
        'SLA garantizado',
        'Múltiples sucursales',
        'Reportes avanzados',
      ],
      popular: false,
      buttonText: 'Elegir Plan Enterprise',
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Volver al Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">Planes y Precios</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Elige el Plan Ideal para tu Empresa
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Precios pensados para el poder adquisitivo de las microempresas colombianas.
              Sin sorpresas, sin costos ocultos.
            </p>
          </div>

          {/* Current Plan Banner */}
          {currentSubscription && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className={`${
                currentSubscription.isValid && currentSubscription.planType === 'TRIAL'
                  ? 'bg-yellow-50 border-yellow-200'
                  : currentSubscription.isValid
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
              }`}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentSubscription.isValid && currentSubscription.planType === 'TRIAL'
                        ? 'bg-yellow-100'
                        : currentSubscription.isValid
                          ? 'bg-emerald-100'
                          : 'bg-red-100'
                    }`}>
                      <Clock className={`w-6 h-6 ${
                        currentSubscription.isValid && currentSubscription.planType === 'TRIAL'
                          ? 'text-yellow-600'
                          : currentSubscription.isValid
                            ? 'text-emerald-600'
                            : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Plan Actual: {currentSubscription.planType === 'TRIAL' ? 'Prueba Gratuita' : 
                          currentSubscription.planType === 'MICRO' ? 'Plan Micro' : 'Plan Empresarial'}
                      </h3>
                      <p className="text-sm text-slate-600">{currentSubscription.message}</p>
                    </div>
                  </div>
                  {!currentSubscription.isValid && (
                    <Badge variant="destructive">Expirado</Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {planCards.map((plan, index) => (
              <motion.div
                key={plan.planType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'border-emerald-500 shadow-lg scale-105' 
                    : 'border-slate-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600">Más Popular</Badge>
                    </div>
                  )}
                  
                  {currentSubscription?.planType === plan.planType && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary" className="bg-slate-800 text-white">
                        Plan Actual
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price === 0 ? '$0' : formatCurrency(plan.price)}
                      </span>
                      <span className="text-slate-500 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={`w-full mt-4 ${
                        plan.popular 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      disabled={
                        plan.disabled || 
                        currentSubscription?.planType === plan.planType ||
                        loading !== null
                      }
                      onClick={() => handleSelectPlan(plan.planType as 'MICRO' | 'ENTERPRISE')}
                    >
                      {loading === plan.planType ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : currentSubscription?.planType === plan.planType ? (
                        'Plan Actual'
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                    
                    {plan.planType !== 'TRIAL' && (
                      <p className="text-xs text-center text-muted-foreground">
                        Facturación mensual • Cancela cuando quieras
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-slate-900 text-white">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <h4 className="font-semibold">Pago Seguro</h4>
                    <p className="text-sm text-slate-400">Transacciones encriptadas SSL</p>
                  </div>
                  <div>
                    <Clock className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <h4 className="font-semibold">Sin Compromiso</h4>
                    <p className="text-sm text-slate-400">Cancela cuando quieras</p>
                  </div>
                  <div>
                    <HeadphonesIcon className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <h4 className="font-semibold">Soporte Local</h4>
                    <p className="text-sm text-slate-400">Atención en Cúcuta</p>
                  </div>
                  <div>
                    <Zap className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <h4 className="font-semibold">Activación Inmediata</h4>
                    <p className="text-sm text-slate-400">Sin esperas ni trámites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: '¿Qué métodos de pago aceptan?',
                  a: 'Aceptamos PSE, tarjetas crédito/débito, Nequi y Daviplata. Facturamos en pesos colombianos.',
                },
                {
                  q: '¿Puedo cambiar de plan después?',
                  a: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. El cambio se aplica inmediatamente.',
                },
                {
                  q: '¿Qué pasa cuando expira mi prueba?',
                  a: 'Tus datos se conservan 30 días. Puedes actualizar tu plan para recuperar acceso completo.',
                },
                {
                  q: '¿Ofrecen facturas electrónicas?',
                  a: 'Sí, todos los planes incluyen facturación electrónica válida en Colombia.',
                },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
