-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA PQRS SaaS
-- Supabase (PostgreSQL)
-- 
-- IMPORTANTE: Ejecutar completo en Supabase SQL Editor
-- ============================================

-- ============================================
-- LIMPIAR TABLAS EXISTENTES (si las hay)
-- ============================================
DROP TABLE IF EXISTS estadisticas CASCADE;
DROP TABLE IF EXISTS archivos CASCADE;
DROP TABLE IF EXISTS seguimientos CASCADE;
DROP TABLE IF EXISTS pqrs CASCADE;
DROP TABLE IF EXISTS respuestas_automaticas CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;

-- Eliminar ENUMs existentes
DROP TYPE IF EXISTS "TipoSeguimiento" CASCADE;
DROP TYPE IF EXISTS "Sentimiento" CASCADE;
DROP TYPE IF EXISTS "Prioridad" CASCADE;
DROP TYPE IF EXISTS "EstadoPqrs" CASCADE;
DROP TYPE IF EXISTS "TipoPqrs" CASCADE;
DROP TYPE IF EXISTS "RolUsuario" CASCADE;
DROP TYPE IF EXISTS "PlanType" CASCADE;

-- ============================================
-- CREAR ENUMs (Nombres exactos que espera Prisma)
-- ============================================
CREATE TYPE "PlanType" AS ENUM ('TRIAL', 'MICRO', 'ENTERPRISE');
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'EMPLEADO', 'SUPERADMIN');
CREATE TYPE "TipoPqrs" AS ENUM ('PETICION', 'QUEJA', 'RECLAMO', 'SUGERENCIA', 'DENUNCIA', 'FELICITACION');
CREATE TYPE "EstadoPqrs" AS ENUM ('PENDIENTE', 'ASIGNADO', 'EN_PROCESO', 'ESPERA_INFO', 'RESUELTO', 'CERRADO', 'RECHAZADO');
CREATE TYPE "Prioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENCIA');
CREATE TYPE "Sentimiento" AS ENUM ('POSITIVO', 'NEUTRO', 'NEGATIVO', 'MUY_NEGATIVO');
CREATE TYPE "TipoSeguimiento" AS ENUM ('COMENTARIO', 'CAMBIO_ESTADO', 'ASIGNACION', 'RESPUESTA', 'CIERRE', 'REAPERTURA');

-- ============================================
-- TABLA: EMPRESAS
-- ============================================
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL DEFAULT 'Cúcuta',
    "planType" "PlanType" NOT NULL DEFAULT 'TRIAL',
    "trialStartDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "empresas_nit_key" ON "empresas"("nit");
CREATE UNIQUE INDEX "empresas_email_key" ON "empresas"("email");

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "rol" "RolUsuario" NOT NULL DEFAULT 'EMPLEADO',
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoAcceso" TIMESTAMP(3),
    
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE INDEX "usuarios_empresaId_idx" ON "usuarios"("empresaId");

ALTER TABLE "usuarios" 
ADD CONSTRAINT "usuarios_empresaId_fkey" 
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- TABLA: CATEGORIAS
-- ============================================
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "categorias_nombre_empresaId_key" ON "categorias"("nombre", "empresaId");
CREATE INDEX "categorias_empresaId_idx" ON "categorias"("empresaId");

ALTER TABLE "categorias" 
ADD CONSTRAINT "categorias_empresaId_fkey" 
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- TABLA: PQRS
-- ============================================
CREATE TABLE "pqrs" (
    "id" TEXT NOT NULL,
    "radicado" TEXT NOT NULL,
    "tipo" "TipoPqrs" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "prioridad" "Prioridad" NOT NULL DEFAULT 'MEDIA',
    "estado" "EstadoPqrs" NOT NULL DEFAULT 'PENDIENTE',
    "categoriaIA" TEXT,
    "confianzaIA" DOUBLE PRECISION,
    "sentimientoIA" "Sentimiento",
    "nombreCiudadano" TEXT NOT NULL,
    "emailCiudadano" TEXT,
    "telefonoCiudadano" TEXT,
    "direccionCiudadano" TEXT,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaLimite" TIMESTAMP(3),
    "fechaCierre" TIMESTAMP(3),
    "asignadoA" TEXT,
    "empresaId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "pqrs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pqrs_radicado_key" ON "pqrs"("radicado");
CREATE INDEX "pqrs_empresaId_idx" ON "pqrs"("empresaId");
CREATE INDEX "pqrs_estado_idx" ON "pqrs"("estado");
CREATE INDEX "pqrs_fechaRecepcion_idx" ON "pqrs"("fechaRecepcion");
CREATE INDEX "pqrs_categoriaId_idx" ON "pqrs"("categoriaId");
CREATE INDEX "pqrs_asignadoA_idx" ON "pqrs"("asignadoA");

ALTER TABLE "pqrs" 
ADD CONSTRAINT "pqrs_empresaId_fkey" 
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pqrs" 
ADD CONSTRAINT "pqrs_categoriaId_fkey" 
FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pqrs" 
ADD CONSTRAINT "pqrs_asignadoA_fkey" 
FOREIGN KEY ("asignadoA") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- TABLA: SEGUIMIENTOS
-- ============================================
CREATE TABLE "seguimientos" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoSeguimiento" NOT NULL,
    "pqrsId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "seguimientos_pqrsId_idx" ON "seguimientos"("pqrsId");
CREATE INDEX "seguimientos_usuarioId_idx" ON "seguimientos"("usuarioId");

ALTER TABLE "seguimientos" 
ADD CONSTRAINT "seguimientos_pqrsId_fkey" 
FOREIGN KEY ("pqrsId") REFERENCES "pqrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seguimientos" 
ADD CONSTRAINT "seguimientos_usuarioId_fkey" 
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================
-- TABLA: ARCHIVOS
-- ============================================
CREATE TABLE "archivos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "pqrsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "archivos_pqrsId_idx" ON "archivos"("pqrsId");

ALTER TABLE "archivos" 
ADD CONSTRAINT "archivos_pqrsId_fkey" 
FOREIGN KEY ("pqrsId") REFERENCES "pqrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- TABLA: RESPUESTAS AUTOMATICAS
-- ============================================
CREATE TABLE "respuestas_automaticas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "respuestas_automaticas_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "respuestas_automaticas_empresaId_idx" ON "respuestas_automaticas"("empresaId");

ALTER TABLE "respuestas_automaticas" 
ADD CONSTRAINT "respuestas_automaticas_empresaId_fkey" 
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- TABLA: ESTADISTICAS
-- ============================================
CREATE TABLE "estadisticas" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPqrs" INTEGER NOT NULL DEFAULT 0,
    "pendientes" INTEGER NOT NULL DEFAULT 0,
    "enProceso" INTEGER NOT NULL DEFAULT 0,
    "resueltos" INTEGER NOT NULL DEFAULT 0,
    "tiempoPromedio" DOUBLE PRECISION,
    "empresaId" TEXT NOT NULL,
    
    CONSTRAINT "estadisticas_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "estadisticas_empresaId_idx" ON "estadisticas"("empresaId");

-- ============================================
-- TRIGGER PARA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers
DROP TRIGGER IF EXISTS update_empresas_updated_at ON "empresas";
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON "usuarios";
DROP TRIGGER IF EXISTS update_pqrs_updated_at ON "pqrs";
DROP TRIGGER IF EXISTS update_categorias_updated_at ON "categorias";
DROP TRIGGER IF EXISTS update_respuestas_updated_at ON "respuestas_automaticas";

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON "empresas"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON "usuarios"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pqrs_updated_at BEFORE UPDATE ON "pqrs"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON "categorias"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_respuestas_updated_at BEFORE UPDATE ON "respuestas_automaticas"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT '✅ Base de datos PQRS SaaS creada exitosamente' as mensaje;
SELECT table_name as "Tabla" FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
