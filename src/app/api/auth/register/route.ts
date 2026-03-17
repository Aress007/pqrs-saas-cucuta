/**
 * API: REGISTRO DE EMPRESA Y USUARIO ADMIN
 * Sistema SaaS PQRS - Multi-tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { empresa: empresaData, usuario: usuarioData } = body;

    // Validar datos requeridos de empresa
    if (!empresaData?.nombre || !empresaData?.nit || !empresaData?.email) {
      return NextResponse.json(
        { error: 'Datos de empresa incompletos: nombre, nit y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar datos requeridos de usuario
    if (!usuarioData?.nombre || !usuarioData?.email || !usuarioData?.password) {
      return NextResponse.json(
        { error: 'Datos de usuario incompletos: nombre, email y password son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si la empresa ya existe
    const empresaExistente = await db.empresa.findFirst({
      where: {
        OR: [{ nit: empresaData.nit }, { email: empresaData.email }],
      },
    });

    if (empresaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una empresa registrada con este NIT o email' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await db.usuario.findUnique({
      where: { email: usuarioData.email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      );
    }

    // Calcular fecha de fin de trial (30 días)
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    // Crear empresa con plan TRIAL
    const empresa = await db.empresa.create({
      data: {
        nombre: empresaData.nombre,
        nit: empresaData.nit,
        direccion: empresaData.direccion || null,
        telefono: empresaData.telefono || null,
        email: empresaData.email,
        ciudad: empresaData.ciudad || 'Cúcuta',
        planType: 'TRIAL',
        trialStartDate,
        trialEndDate,
        isActive: true,
      },
    });

    // Hashear contraseña
    const hashedPassword = await hashPassword(usuarioData.password);

    // Crear usuario administrador
    const usuario = await db.usuario.create({
      data: {
        email: usuarioData.email,
        password: hashedPassword,
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido || null,
        rol: 'ADMIN',
        activo: true,
        empresaId: empresa.id,
      },
    });

    // Crear categorías por defecto
    const categoriasDefault = [
      { nombre: 'Facturación', color: '#EF4444', descripcion: 'Consultas sobre facturas y pagos' },
      { nombre: 'Producto', color: '#F59E0B', descripcion: 'Consultas sobre productos' },
      { nombre: 'Servicio', color: '#10B981', descripcion: 'Quejas y sugerencias de servicio' },
      { nombre: 'Entrega', color: '#3B82F6', descripcion: 'Problemas con entregas' },
      { nombre: 'Calidad', color: '#8B5CF6', descripcion: 'Problemas de calidad' },
      { nombre: 'Personal', color: '#EC4899', descripcion: 'Atención al personal' },
      { nombre: 'Instalaciones', color: '#6366F1', descripcion: 'Problemas con instalaciones' },
      { nombre: 'General', color: '#6B7280', descripcion: 'Otras consultas' },
    ];

    await db.categoria.createMany({
      data: categoriasDefault.map((cat) => ({
        ...cat,
        empresaId: empresa.id,
      })),
    });

    // Generar token JWT
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaId: empresa.id,
    });

    // Retornar datos sin contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json(
      {
        message: 'Registro exitoso',
        empresa: {
          id: empresa.id,
          nombre: empresa.nombre,
          planType: empresa.planType,
          trialEndDate: empresa.trialEndDate,
        },
        usuario: usuarioSinPassword,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
