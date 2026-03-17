#!/bin/bash

# ============================================
# SCRIPT DE PREPARACIÓN PARA SUPABASE
# PQRS SaaS - Configuración Rápida
# ============================================

echo "========================================"
echo "🚀 Preparando proyecto para Supabase"
echo "========================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir éxito
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para imprimir advertencia
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para imprimir error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

print_success "Directorio del proyecto detectado"

# Paso 1: Crear backup del schema actual
echo ""
echo "📦 Paso 1: Creando backup del schema actual..."
if [ -f "prisma/schema.prisma" ]; then
    cp prisma/schema.prisma prisma/schema-sqlite-backup.prisma
    print_success "Backup creado: prisma/schema-sqlite-backup.prisma"
else
    print_warning "No se encontró schema.prisma para hacer backup"
fi

# Paso 2: Copiar schema de Supabase
echo ""
echo "📦 Paso 2: Configurando schema para PostgreSQL..."
if [ -f "prisma/schema-supabase.prisma" ]; then
    cp prisma/schema-supabase.prisma prisma/schema.prisma
    print_success "Schema PostgreSQL configurado"
else
    print_error "No se encontró prisma/schema-supabase.prisma"
    exit 1
fi

# Paso 3: Crear .env.local si no existe
echo ""
echo "📦 Paso 3: Configurando variables de entorno..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    print_success "Archivo .env.local creado"
    print_warning "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase"
else
    print_warning ".env.local ya existe, no se sobrescribió"
fi

# Paso 4: Instalar dependencias
echo ""
echo "📦 Paso 4: Verificando dependencias..."
if command -v bun &> /dev/null; then
    echo "Ejecutando bun install..."
    bun install
    print_success "Dependencias instaladas con Bun"
elif command -v npm &> /dev/null; then
    echo "Ejecutando npm install..."
    npm install
    print_success "Dependencias instaladas con NPM"
else
    print_error "No se encontró npm ni bun"
    exit 1
fi

# Paso 5: Generar cliente Prisma
echo ""
echo "📦 Paso 5: Generando cliente Prisma..."
if command -v npx &> /dev/null; then
    npx prisma generate
    print_success "Cliente Prisma generado"
else
    print_warning "No se pudo generar el cliente Prisma. Ejecuta manualmente: npx prisma generate"
fi

# Resumen final
echo ""
echo "========================================"
echo "✅ ¡Configuración completada!"
echo "========================================"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Ve a Supabase (https://supabase.com) y crea un proyecto"
echo "2. Ejecuta el SQL desde: db/schema-supabase.sql"
echo "3. Copia las credenciales de Supabase a .env.local:"
echo "   - DATABASE_URL"
echo "   - DIRECT_URL"
echo "4. Genera secretos para:"
echo "   - NEXTAUTH_SECRET: openssl rand -base64 32"
echo "   - JWT_SECRET: openssl rand -base64 32"
echo "5. Ejecuta: npx prisma db push (para sincronizar)"
echo "6. Inicia el servidor: npm run dev"
echo ""
echo "📄 Archivos importantes:"
echo "   - README-DEPLOYMENT.md (Guía completa)"
echo "   - db/schema-supabase.sql (SQL para Supabase)"
echo "   - .env.example (Plantilla de variables)"
echo ""
echo "🎯 Para desplegar en Vercel:"
echo "   1. Sube el proyecto a GitHub"
echo "   2. Conecta con Vercel"
echo "   3. Configura las variables de entorno"
echo ""
