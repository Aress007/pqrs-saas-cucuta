/**
 * ============================================
 * API: GESTIÓN DE SUSCRIPCIÓN
 * Verificación y actualización de planes
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractToken, checkSubscription } from '@/lib/auth';

// GET - Estado de suscripción
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const empresa = await db.empresa.findUnique({
      where: { id: decoded.empresaId },
      select: {
        id: true,
        nombre: true,
        planType: true,
        trialStartDate: true,
        trialEndDate: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        isActive: true,
      },
    });

    if (!empresa) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    const subscription = await checkSubscription(decoded.empresaId);

    return NextResponse.json({
      empresa,
      subscription,
      plans: {
        TRIAL: {
          name: 'Prueba Gratuita',
          price: 0,
          duration: '30 días',
          features: ['Hasta 50 PQRS', 'Clasificación IA básica', 'Soporte por email'],
        },
        MICRO: {
          name: 'Plan Micro',
          price: 49900,
          duration: 'mes',
          features: ['PQRS ilimitadas', 'Clasificación IA avanzada', 'Reportes básicos', 'Soporte prioritario'],
        },
        ENTERPRISE: {
          name: 'Plan Empresarial',
          price: 149900,
          duration: 'mes',
          features: ['PQRS ilimitadas', 'Clasificación IA avanzada', 'Reportes completos', 'API REST', 'Soporte 24/7', 'Usuarios ilimitados'],
        },
      },
    });

  } catch (error) {
    console.error('Error al obtener suscripción:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Simular actualización de plan (demo)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo administradores pueden cambiar el plan' }, { status: 403 });
    }

    const body = await request.json();
    const { planType } = body;

    if (!['MICRO', 'ENTERPRISE'].includes(planType)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Calcular fechas de suscripción
    const subscriptionStart = new Date();
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); // 1 mes

    // Actualizar empresa
    const empresa = await db.empresa.update({
      where: { id: decoded.empresaId },
      data: {
        planType,
        subscriptionStart,
        subscriptionEnd,
        isActive: true,
      },
    });

    const subscription = await checkSubscription(decoded.empresaId);

    return NextResponse.json({
      message: `Plan actualizado a ${planType} exitosamente`,
      empresa: {
        id: empresa.id,
        planType: empresa.planType,
        subscriptionStart: empresa.subscriptionStart,
        subscriptionEnd: empresa.subscriptionEnd,
      },
      subscription,
    });

  } catch (error) {
    console.error('Error al actualizar plan:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
