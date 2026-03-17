'use client';

/**
 * ============================================
 * PÁGINA PRINCIPAL - SaaS PQRS
 * Gestión Inteligente de PQRS para Microempresas
 * ============================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MessageSquare, 
  Brain, 
  BarChart3, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthModal from '@/components/auth/AuthModal';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const features = [
    {
      icon: Brain,
      title: 'Clasificación Inteligente con IA',
      description: 'Clasificación automática de PQRS usando procesamiento de lenguaje natural entrenado con jerga local de Cúcuta.',
    },
    {
      icon: Clock,
      title: 'Cumplimiento Normativo',
      description: 'Control automático de los 15 días hábiles establecidos por la Ley 1755 de 2015 para respuesta a ciudadanos.',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analítico',
      description: 'Métricas en tiempo real sobre el estado de PQRS, tiempos de respuesta y satisfacción ciudadana.',
    },
    {
      icon: Shield,
      title: 'Seguridad y Confidencialidad',
      description: 'Datos encriptados y respaldo automático. Cumplimiento de la Ley 1581 de Protección de Datos.',
    },
    {
      icon: MessageSquare,
      title: 'Seguimiento Completo',
      description: 'Historial detallado de cada interacción con notificaciones automáticas al ciudadano.',
    },
    {
      icon: Building2,
      title: 'Multi-empresa',
      description: 'Cada microempresa tiene su propio espacio aislado con configuración personalizada.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Prueba Gratuita',
      price: '$0',
      period: '30 días',
      description: 'Perfecto para conocer la plataforma',
      features: [
        'Hasta 50 PQRS',
        'Clasificación IA básica',
        'Dashboard básico',
        'Soporte por email',
      ],
      popular: false,
      buttonText: 'Comenzar Gratis',
      planType: 'TRIAL',
    },
    {
      name: 'Plan Micro',
      price: '$49.900',
      period: '/mes',
      description: 'Ideal para microempresas',
      features: [
        'PQRS ilimitadas',
        'Clasificación IA avanzada',
        'Reportes completos',
        'Usuarios ilimitados',
        'Soporte prioritario',
        'Recordatorios automáticos',
      ],
      popular: true,
      buttonText: 'Elegir Plan Micro',
      planType: 'MICRO',
    },
    {
      name: 'Plan Empresarial',
      price: '$149.900',
      period: '/mes',
      description: 'Para empresas en crecimiento',
      features: [
        'Todo lo del Plan Micro',
        'API REST completa',
        'Integraciones personalizadas',
        'Soporte 24/7',
        'Capacitación incluida',
        'SLA garantizado',
      ],
      popular: false,
      buttonText: 'Elegir Plan Enterprise',
      planType: 'ENTERPRISE',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">PQRS Inteligente</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Precios
              </a>
              <Button 
                variant="ghost" 
                onClick={() => handleOpenAuth('login')}
                className="text-slate-600"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => handleOpenAuth('register')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Registrar Empresa
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-slate-600 hover:text-slate-900">
                  Características
                </a>
                <a href="#pricing" className="block text-slate-600 hover:text-slate-900">
                  Precios
                </a>
                <Button 
                  variant="ghost" 
                  onClick={() => { handleOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="w-full"
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  onClick={() => { handleOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Registrar Empresa
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-800 border-emerald-200">
              Diseñado para el Área Metropolitana de Cúcuta
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Gestión Inteligente de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                PQRS
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Sistema SaaS con Inteligencia Artificial para que microempresas de Cúcuta, 
              Villa del Rosario y Los Patios gestionen Peticiones, Quejas, Reclamos y Sugerencias 
              de forma eficiente y cumpliendo la normativa colombiana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => handleOpenAuth('register')}
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleOpenAuth('login')}
                className="text-lg px-8"
              >
                Ya tengo cuenta
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              ✓ Prueba gratuita de 30 días ✓ Sin tarjeta de crédito ✓ Configuración en 5 minutos
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-50" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Diseñado específicamente para las necesidades de las microempresas del Norte de Santander
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Planes y Precios
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Precios pensados para el poder adquisitivo de las microempresas colombianas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-emerald-500 shadow-lg scale-105' : 'border-slate-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600">Más Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-4 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleOpenAuth('register')}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar la gestión de PQRS de tu empresa?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Únete a las microempresas que ya están ofreciendo mejor atención a sus clientes
          </p>
          <Button 
            size="lg"
            onClick={() => handleOpenAuth('register')}
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8"
          >
            Registrar Mi Empresa Gratis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        open={showAuth} 
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />
    </div>
  );
}
