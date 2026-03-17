/**
 * ============================================
 * UTILIDADES DE AUTENTICACIÓN
 * Modelo de Negocio SaaS para Gestión de PQRS
 * ============================================
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'pqrs-saas-secret-key-2024';

export interface JwtPayload {
  userId: string;
  email: string;
  rol: string;
  empresaId: string;
}

/**
 * Hashear contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verificar contraseña
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generar token JWT
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verificar token JWT
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extraer token del header Authorization
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verificar estado de suscripción de la empresa
 * Retorna: { isValid: boolean, daysRemaining: number, planType: string }
 */
export async function checkSubscription(empresaId: string): Promise<{
  isValid: boolean;
  daysRemaining: number;
  planType: string;
  message: string;
}> {
  const empresa = await db.empresa.findUnique({
    where: { id: empresaId },
    select: {
      planType: true,
      trialStartDate: true,
      trialEndDate: true,
      isActive: true,
      subscriptionStart: true,
      subscriptionEnd: true,
    },
  });

  if (!empresa) {
    return {
      isValid: false,
      daysRemaining: 0,
      planType: 'NONE',
      message: 'Empresa no encontrada',
    };
  }

  if (!empresa.isActive) {
    return {
      isValid: false,
      daysRemaining: 0,
      planType: empresa.planType,
      message: 'La cuenta está desactivada',
    };
  }

  const now = new Date();

  // Si es plan TRIAL
  if (empresa.planType === 'TRIAL') {
    const trialEnd = empresa.trialEndDate || 
      new Date(empresa.trialStartDate?.getTime() || Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const diffTime = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      return {
        isValid: false,
        daysRemaining: 0,
        planType: 'TRIAL',
        message: 'Su período de prueba ha expirado. ¡Actualice su plan!',
      };
    }

    return {
      isValid: true,
      daysRemaining,
      planType: 'TRIAL',
      message: `Período de prueba: ${daysRemaining} días restantes`,
    };
  }

  // Si es plan MICRO o ENTERPRISE
  if (empresa.subscriptionEnd) {
    const diffTime = empresa.subscriptionEnd.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      return {
        isValid: false,
        daysRemaining: 0,
        planType: empresa.planType,
        message: 'Su suscripción ha expirado. ¡Renueve su plan!',
      };
    }

    return {
      isValid: true,
      daysRemaining,
      planType: empresa.planType,
      message: `Suscripción activa: ${daysRemaining} días restantes`,
    };
  }

  return {
    isValid: true,
    daysRemaining: 999,
    planType: empresa.planType,
    message: 'Suscripción activa',
  };
}

/**
 * Calcular fecha límite de PQRS (15 días hábiles)
 */
export function calculateDeadline(startDate: Date = new Date()): Date {
  const deadline = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < 15) {
    deadline.setDate(deadline.getDate() + 1);
    const dayOfWeek = deadline.getDay();
    // Excluir sábados (6) y domingos (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  
  return deadline;
}

/**
 * Generar número de radicado único
 */
export function generateRadicado(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PQRS-${year}${month}${day}-${random}`;
}
