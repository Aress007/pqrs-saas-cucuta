# 🚀 Guía de Despliegue - Sistema PQRS SaaS

## ✅ Resumen Rápido

| Paso | Descripción | Tiempo |
|------|-------------|--------|
| 1 | Subir código a GitHub | 5 min |
| 2 | Ejecutar SQL en Supabase | 3 min |
| 3 | Configurar Vercel | 5 min |
| **Total** | **Aplicación en producción** | **~15 min** |

---

## 📋 Requisitos

- ✅ Cuenta de GitHub (gratuita)
- ✅ Cuenta de Supabase (gratuita)
- ✅ Cuenta de Vercel (gratuita)

---

## 📦 Paso 1: Subir a GitHub

### Si ya tienes el repositorio:

```bash
cd tu-carpeta-del-proyecto

# Agregar todos los archivos
git add .

# Crear commit
git commit -m "Actualizar proyecto PQRS SaaS"

# Subir a GitHub
git push
```

### Si es un nuevo repositorio:

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio llamado `pqrs-saas-cucuta`
2. En tu carpeta del proyecto ejecuta:

```bash
git init
git add .
git commit -m "Initial commit - Sistema PQRS SaaS"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pqrs-saas-cucuta.git
git push -u origin main
```

---

## 🗄️ Paso 2: Configurar Supabase

### 2.1 Ir al proyecto existente

1. Ve a [supabase.com](https://supabase.com)
2. Entra a tu proyecto: `pqrs-saas-cucuta` (fhivkfdlqjoqsqpadjhg)

### 2.2 Ejecutar el SQL

1. En el menú izquierdo, ve a **SQL Editor**
2. Haz clic en **New Query**
3. **Copia y pega** todo el contenido del archivo `db/schema-supabase.sql`
4. Haz clic en **Run** (o presiona Ctrl+Enter)

### 2.3 Verificar que se crearon las tablas

Ejecuta esta consulta:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

Debes ver:
- empresas
- usuarios
- categorias
- pqrs
- seguimientos
- archivos
- respuestas_automaticas
- estadisticas

### 2.4 Obtener la URL de conexión

1. Ve a **Settings** (engranaje) → **Database**
2. En **Connection string**, selecciona **URI**
3. Copia la URL

**Tu URL debe verse así:**
```
postgresql://postgres:TU_PASSWORD@db.fhivkfdlqjoqsqpadjhg.supabase.co:5432/postgres
```

---

## ▲ Paso 3: Configurar Vercel

### 3.1 Ir al proyecto existente

1. Ve a [vercel.com](https://vercel.com)
2. Entra a tu proyecto: `pqrs-saas-cucuta`

### 3.2 Configurar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**
2. Configura estas variables:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:TU_PASSWORD@db.fhivkfdlqjoqsqpadjhg.supabase.co:5432/postgres` |
| `JWT_SECRET` | `mi-clave-super-secreta-pqrs-2024-cucuta` |

**⚠️ IMPORTANTE sobre DATABASE_URL:**

- Reemplaza `TU_PASSWORD` con tu contraseña de Supabase
- Si tienes problemas de conexión, agrega `?sslmode=require` al final:
  ```
  postgresql://postgres:TU_PASSWORD@db.fhivkfdlqjoqsqpadjhg.supabase.co:5432/postgres?sslmode=require
  ```

### 3.3 Redesplegar

1. Ve a **Deployments**
2. Haz clic en los 3 puntos `...` del último despliegue
3. Selecciona **Redeploy**

O simplemente haz un push a GitHub y Vercel redesplegará automáticamente.

---

## ✅ Paso 4: Verificar el Despliegue

### 4.1 Probar la aplicación

1. Abre tu URL de Vercel: `https://pqrs-saas-cucuta.vercel.app`
2. Intenta **registrar una nueva empresa**
3. Si funciona, ¡todo está correcto!

### 4.2 Si hay errores

Ve a **Vercel Dashboard** → Tu proyecto → **Deployments** → **Functions** para ver los logs.

---

## 🔧 Solución de Problemas

### Error: "Error interno del servidor" al registrar

**Causas posibles:**

1. **DATABASE_URL incorrecta**
   - Verifica que la contraseña sea correcta
   - Agrega `?sslmode=require` al final

2. **Tablas no creadas en Supabase**
   - Ve a SQL Editor y ejecuta el contenido de `db/schema-supabase.sql`

3. **Variable JWT_SECRET faltante**
   - Agrega `JWT_SECRET` en Vercel → Settings → Environment Variables

### Error: "relation does not exist"

Las tablas no se crearon. Ejecuta el SQL del Paso 2.2

### Error: "ssl required"

Agrega `?sslmode=require` al final de tu DATABASE_URL

### La página no carga estilos

1. Espera unos minutos
2. Limpia caché del navegador (Ctrl+Shift+R)
3. Verifica que el build haya terminado

---

## 📞 URLs Importantes

| Servicio | URL |
|----------|-----|
| Aplicación | `https://pqrs-saas-cucuta.vercel.app` |
| Vercel Dashboard | `https://vercel.com/tu-usuario/pqrs-saas-cucuta` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/fhivkfdlqjoqsqpadjhg` |
| GitHub | `https://github.com/tu-usuario/pqrs-saas-cucuta` |

---

## 🔄 Actualizar la Aplicación

Para hacer cambios después del despliegue:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel detectará automáticamente y redesplegará.

---

## 📝 Resumen de Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión PostgreSQL | `postgresql://postgres:pass@host:5432/postgres` |
| `JWT_SECRET` | Secreto para tokens | Cualquier texto largo aleatorio |

---

*Guía creada para el proyecto PQRS SaaS - SENA Cúcuta*
