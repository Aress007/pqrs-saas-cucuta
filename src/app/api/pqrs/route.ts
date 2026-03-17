/**
 * ============================================
 * API: GESTIÓN DE PQRS
 * CRUD completo con clasificación IA
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, extractToken, checkSubscription, generateRadicado, calculateDeadline } from '@/lib/auth';
import { classifyPqrs, extractEntities } from '@/lib/nlp-service';

// GET - Listar PQRS de la empresa
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

    // Verificar suscripción
    const subscription = await checkSubscription(decoded.empresaId);
    if (!subscription.isValid) {
      return NextResponse.json({ 
        error: 'Suscripción expirada', 
        subscription,
        code: 'SUBSCRIPTION_EXPIRED' 
      }, { status: 402 });
    }

    // Parámetros de consulta
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const tipo = searchParams.get('tipo');
    const prioridad = searchParams.get('prioridad');
    const busqueda = searchParams.get('busqueda');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Construir filtros
    const where: Record<string, unknown> = { empresaId: decoded.empresaId };
    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;
    if (prioridad) where.prioridad = prioridad;
    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda } },
        { descripcion: { contains: busqueda } },
        { radicado: { contains: busqueda } },
        { nombreCiudadano: { contains: busqueda } },
      ];
    }

    // Obtener total y datos paginados
    const [total, pqrs] = await Promise.all([
      db.pqrs.count({ where }),
      db.pqrs.findMany({
        where,
        include: {
          categoria: { select: { nombre: true, color: true } },
          asignado: { select: { nombre: true, email: true } },
          seguimientos: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      pqrs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      subscription,
    });

  } catch (error) {
    console.error('Error al listar PQRS:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva PQRS
export async function POST(request: NextRequest) {
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

    // Verificar suscripción
    const subscription = await checkSubscription(decoded.empresaId);
    if (!subscription.isValid) {
      return NextResponse.json({ 
        error: 'Suscripción expirada', 
        subscription,
        code: 'SUBSCRIPTION_EXPIRED' 
      }, { status: 402 });
    }

    const body = await request.json();
    const {
      tipo,
      titulo,
      descripcion,
      nombreCiudadano,
      emailCiudadano,
      telefonoCiudadano,
      direccionCiudadano,
      categoriaId,
    } = body;

    // Validar campos requeridos
    if (!titulo || !descripcion || !nombreCiudadano) {
      return NextResponse.json(
        { error: 'Título, descripción y nombre del ciudadano son requeridos' },
        { status: 400 }
      );
    }

    // Clasificar con IA
    const clasificacionIA = classifyPqrs(`${titulo} ${descripcion}`);
    const entidades = extractEntities(`${titulo} ${descripcion}`);

    // Generar radicado y fecha límite
    const radicado = generateRadicado();
    const fechaLimite = calculateDeadline();

    // Crear PQRS
    const pqrs = await db.pqrs.create({
      data: {
        radicado,
        tipo: tipo || clasificacionIA.tipo as 'PETICION' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA' | 'DENUNCIA' | 'FELICITACION',
        titulo,
        descripcion,
        prioridad: clasificacionIA.prioridadSugerida as 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENCIA',
        nombreCiudadano,
        emailCiudadano: emailCiudadano || (entidades.emails[0] || null),
        telefonoCiudadano: telefonoCiudadano || (entidades.telefonos[0] || null),
        direccionCiudadano,
        categoriaIA: clasificacionIA.categoria,
        confianzaIA: clasificacionIA.confianza,
        sentimientoIA: clasificacionIA.sentimiento as 'POSITIVO' | 'NEUTRO' | 'NEGATIVO' | 'MUY_NEGATIVO',
        fechaLimite,
        empresaId: decoded.empresaId,
        categoriaId,
      },
      include: {
        categoria: { select: { nombre: true, color: true } },
      },
    });

    // Crear seguimiento inicial
    await db.seguimiento.create({
      data: {
        pqrsId: pqrs.id,
        usuarioId: decoded.userId,
        descripcion: `PQRS radicada exitosamente. Clasificación IA: ${clasificacionIA.tipo} (${Math.round(clasificacionIA.confianza * 100)}% confianza)`,
        tipo: 'COMENTARIO',
      },
    });

    return NextResponse.json({
      message: 'PQRS creada exitosamente',
      pqrs,
      clasificacionIA,
      subscription,
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear PQRS:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
