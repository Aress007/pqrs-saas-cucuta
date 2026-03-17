/**
 * ============================================
 * API: LOGIN DE USUARIO
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken, checkSubscription } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await db.usuario.findUnique({
      where: { email },
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
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo. Contacte al administrador' },
        { status: 403 }
      );
    }

    // Verificar contraseña
    const passwordValida = await verifyPassword(password, usuario.password);
    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar estado de suscripción
    const subscriptionStatus = await checkSubscription(usuario.empresaId);

    // Actualizar último acceso
    await db.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    });

    // Generar token JWT
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaId: usuario.empresaId,
    });

    // Retornar datos sin contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      message: 'Login exitoso',
      usuario: usuarioSinPassword,
      empresa: usuario.empresa,
      subscription: subscriptionStatus,
      token,
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
