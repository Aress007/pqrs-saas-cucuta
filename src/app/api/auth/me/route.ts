/**
 * ============================================
 * API: VERIFICAR SESIÓN ACTUAL
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractToken, checkSubscription } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    // Obtener usuario actualizado
    const usuario = await db.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true,
            nit: true,
            email: true,
            planType: true,
            trialStartDate: true,
            trialEndDate: true,
            subscriptionStart: true,
            subscriptionEnd: true,
            isActive: true,
            ciudad: true,
            telefono: true,
            direccion: true,
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar estado de suscripción
    const subscriptionStatus = await checkSubscription(usuario.empresaId);

    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      usuario: usuarioSinPassword,
      empresa: usuario.empresa,
      subscription: subscriptionStatus,
    });

  } catch (error) {
    console.error('Error en verificación de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
