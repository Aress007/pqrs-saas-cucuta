/**
 * ============================================
 * STORE: Estado Global de la Aplicación
 * ============================================
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  rol: string;
  empresaId: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  email: string;
  planType: 'TRIAL' | 'MICRO' | 'ENTERPRISE';
  trialEndDate?: string;
  subscriptionEnd?: string;
  isActive: boolean;
  ciudad: string;
}

export interface SubscriptionStatus {
  isValid: boolean;
  daysRemaining: number;
  planType: string;
  message: string;
}

interface AuthState {
  usuario: Usuario | null;
  empresa: Empresa | null;
  subscription: SubscriptionStatus | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setAuth: (data: {
    usuario: Usuario;
    empresa: Empresa;
    subscription: SubscriptionStatus;
    token: string;
  }) => void;
  
  updateSubscription: (subscription: SubscriptionStatus) => void;
  
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      empresa: null,
      subscription: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (data) => set({
        usuario: data.usuario,
        empresa: data.empresa,
        subscription: data.subscription,
        token: data.token,
        isAuthenticated: true,
      }),
      
      updateSubscription: (subscription) => set({ subscription }),
      
      logout: () => set({
        usuario: null,
        empresa: null,
        subscription: null,
        token: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'pqrs-auth-storage',
    }
  )
);

// Utilidades para la API
const API_BASE = '/api';

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
