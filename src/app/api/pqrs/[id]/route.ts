/**
 * ============================================
 * API: OPERACIONES SOBRE PQRS INDIVIDUAL
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractToken, checkSubscription } from '@/lib/auth';

// GET - Obtener PQRS por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const subscription = await checkSubscription(decoded.empresaId);
    if (!subscription.isValid) {
      return NextResponse.json({ 
        error: 'Suscripción expirada',
        subscription,
        code: 'SUBSCRIPTION_EXPIRED' 
      }, { status: 402 });
    }

    const pqrs = await db.pqrs.findFirst({
      where: { id, empresaId: decoded.empresaId },
      include: {
        categoria: true,
        asignado: { select: { id: true, nombre: true, email: true } },
        seguimientos: {
          include: { usuario: { select: { nombre: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
        archivos: true,
      },
    });

    if (!pqrs) {
      return NextResponse.json({ error: 'PQRS no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ pqrs, subscription });

  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar PQRS
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const subscription = await checkSubscription(decoded.empresaId);
    if (!subscription.isValid) {
      return NextResponse.json({ 
        error: 'Suscripción expirada',
        code: 'SUBSCRIPTION_EXPIRED' 
      }, { status: 402 });
    }

    const body = await request.json();
    const { estado, prioridad, asignadoA, categoriaId } = body;

    // Verificar que la PQRS existe
    const pqrsExistente = await db.pqrs.findFirst({
      where: { id, empresaId: decoded.empresaId },
    });

    if (!pqrsExistente) {
      return NextResponse.json({ error: 'PQRS no encontrada' }, { status: 404 });
    }

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {};
    const seguimientos = [];

    if (estado && estado !== pqrsExistente.estado) {
      updateData.estado = estado;
      if (estado === 'RESUELTO' || estado === 'CERRADO') {
        updateData.fechaCierre = new Date();
      }
      seguimientos.push({
        pqrsId: id,
        usuarioId: decoded.userId,
        descripcion: `Estado cambiado a: ${estado}`,
        tipo: 'CAMBIO_ESTADO',
      });
    }

    if (prioridad && prioridad !== pqrsExistente.prioridad) {
      updateData.prioridad = prioridad;
    }

    if (asignadoA !== undefined) {
      updateData.asignadoA = asignadoA || null;
      seguimientos.push({
        pqrsId: id,
        usuarioId: decoded.userId,
        descripcion: asignadoA ? `Asignado a usuario` : 'Sin asignar',
        tipo: 'ASIGNACION',
      });
    }

    if (categoriaId !== undefined) {
      updateData.categoriaId = categoriaId || null;
    }

    // Actualizar PQRS
    const pqrs = await db.pqrs.update({
      where: { id },
      data: updateData,
    });

    // Crear seguimientos
    if (seguimientos.length > 0) {
      await db.seguimiento.createMany({ data: seguimientos });
    }

    return NextResponse.json({ message: 'PQRS actualizada', pqrs });

  } catch (error) {
    console.error('Error al actualizar PQRS:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar PQRS (solo ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Eliminar PQRS (cascade elimina seguimientos y archivos)
    await db.pqrs.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'PQRS eliminada' });

  } catch (error) {
    console.error('Error al eliminar PQRS:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
