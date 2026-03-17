'use client';

/**
 * ============================================
 * FOOTER COMPONENT
 * ============================================
 */

import { MessageSquare, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PQRS Inteligente</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Sistema SaaS para la gestión inteligente de Peticiones, Quejas, Reclamos y Sugerencias. 
              Diseñado para microempresas del Área Metropolitana de Cúcuta.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              Proyecto SENA - Etapa Productiva I+D+i
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold text-white mb-3">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Características</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentación</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">API</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ley 1581 de 2012</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Ley 1755 de 2015</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-1">
            Desarrollado con <Heart className="w-4 h-4 text-red-500" /> en Cúcuta, Colombia © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
