/**
 * ============================================
 * API: ESTADÍSTICAS DEL DASHBOARD
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
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const subscription = await checkSubscription(decoded.empresaId);

    // Obtener estadísticas generales
    const [
      totalPqrs,
      pendientes,
      enProceso,
      resueltos,
      cerrados,
      pqrsPorTipo,
      pqrsPorPrioridad,
      pqrsRecientes,
      pqrsProximasVencer,
    ] = await Promise.all([
      // Total PQRS
      db.pqrs.count({ where: { empresaId: decoded.empresaId } }),
      
      // Por estado
      db.pqrs.count({ where: { empresaId: decoded.empresaId, estado: 'PENDIENTE' } }),
      db.pqrs.count({ where: { empresaId: decoded.empresaId, estado: 'EN_PROCESO' } }),
      db.pqrs.count({ where: { empresaId: decoded.empresaId, estado: 'RESUELTO' } }),
      db.pqrs.count({ where: { empresaId: decoded.empresaId, estado: 'CERRADO' } }),
      
      // Por tipo
      db.pqrs.groupBy({
        by: ['tipo'],
        where: { empresaId: decoded.empresaId },
        _count: { tipo: true },
      }),
      
      // Por prioridad
      db.pqrs.groupBy({
        by: ['prioridad'],
        where: { empresaId: decoded.empresaId },
        _count: { prioridad: true },
      }),
      
      // Últimas 5 PQRS
      db.pqrs.findMany({
        where: { empresaId: decoded.empresaId },
        select: {
          id: true,
          radicado: true,
          titulo: true,
          tipo: true,
          estado: true,
          prioridad: true,
          createdAt: true,
          nombreCiudadano: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      
      // PQRS próximas a vencer (7 días)
      db.pqrs.count({
        where: {
          empresaId: decoded.empresaId,
          estado: { notIn: ['RESUELTO', 'CERRADO', 'RECHAZADO'] },
          fechaLimite: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calcular tiempo promedio de respuesta
    const pqrsConFechas = await db.pqrs.findMany({
      where: {
        empresaId: decoded.empresaId,
        fechaCierre: { not: null },
      },
      select: {
        createdAt: true,
        fechaCierre: true,
      },
    });

    let tiempoPromedioRespuesta = 0;
    if (pqrsConFechas.length > 0) {
      const tiempos = pqrsConFechas.map(p => {
        const diff = (p.fechaCierre!.getTime() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return diff;
      });
      tiempoPromedioRespuesta = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length);
    }

    return NextResponse.json({
      estadisticas: {
        total: totalPqrs,
        pendientes,
        enProceso,
        resueltos,
        cerrados,
        tiempoPromedioRespuesta,
        proximasVencer: pqrsProximasVencer,
      },
      porTipo: pqrsPorTipo.map(t => ({ tipo: t.tipo, cantidad: t._count.tipo })),
      porPrioridad: pqrsPorPrioridad.map(p => ({ prioridad: p.prioridad, cantidad: p._count.prioridad })),
      recientes: pqrsRecientes,
      subscription,
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
