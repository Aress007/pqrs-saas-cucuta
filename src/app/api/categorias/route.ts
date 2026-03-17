/**
 * ============================================
 * API: CATEGORÍAS
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractToken, checkSubscription } from '@/lib/auth';

// GET - Listar categorías
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

    const categorias = await db.categoria.findMany({
      where: { empresaId: decoded.empresaId },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json({ categorias });

  } catch (error) {
    console.error('Error al listar categorías:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear categoría
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { nombre, descripcion, color } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
    }

    const categoria = await db.categoria.create({
      data: {
        nombre,
        descripcion,
        color: color || '#3B82F6',
        empresaId: decoded.empresaId,
      },
    });

    return NextResponse.json({ categoria }, { status: 201 });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
