/**
 * ============================================
 * GENERADOR DE DOCUMENTO SENA
 * Proyecto: Modelo de Negocio SaaS para Gestión Inteligente de PQRS
 * ============================================
 */

const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, 
  ShadingType, VerticalAlign, PageBreak, TableOfContents,
  Header, Footer, PageNumber, LevelFormat
} = require('docx');
const fs = require('fs');

// Colores del documento
const colors = {
  primary: '0B1220',
  body: '0F172A',
  secondary: '2B2B2B',
  accent: '9AA6B2',
  tableBg: 'F1F5F9',
  emerald: '059669',
};

// Función para crear celda de tabla
const createCell = (text, options = {}) => {
  const { bold = false, width = 4680, header = false, align = AlignmentType.LEFT } = options;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { fill: colors.tableBg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: bold || header,
            size: 22,
            color: colors.body,
          }),
        ],
      }),
    ],
  });
};

// Crear el documento
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 },
      },
    },
    paragraphStyles: [
      {
        id: 'Title',
        name: 'Title',
        basedOn: 'Normal',
        run: { size: 56, bold: true, color: colors.primary },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER },
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 32, bold: true, color: colors.primary },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, color: colors.secondary },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullet-list',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: 'numbered-list',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // PORTADA
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'SERVICIO NACIONAL DE APRENDIZAJE - SENA',
              bold: true,
              size: 28,
              color: colors.primary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: 'Regional Norte de Santander',
              size: 24,
              color: colors.secondary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: 'Centro de Comercio y Turismo',
              size: 24,
              color: colors.secondary,
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'PROYECTO DE ETAPA PRODUCTIVA',
              bold: true,
              size: 32,
              color: colors.emerald,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: 'Modalidad: Investigación, Desarrollo e Innovación (I+D+i)',
              size: 24,
              color: colors.secondary,
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: '"MODELO DE NEGOCIO SAAS PARA LA GESTIÓN',
              bold: true,
              size: 36,
              color: colors.primary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'INTELIGENTE DE PQRS EN MICROEMPRESAS',
              bold: true,
              size: 36,
              color: colors.primary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'DEL ÁREA METROPOLITANA DE CÚCUTA"',
              bold: true,
              size: 36,
              color: colors.primary,
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Aprendiz: [Nombre del Aprendiz]', size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: 'Programa: Tecnólogo en Análisis y Desarrollo de Software', size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: 'Ficha: [Número de Ficha]', size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: 'Instructor Líder: [Nombre del Instructor]', size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Cúcuta, Norte de Santander', size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long' }), size: 24, color: colors.body }),
          ],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // CONTENIDO PRINCIPAL
    {
      properties: {
        page: { margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: 'Modelo de Negocio SaaS para Gestión de PQRS', size: 18, color: colors.accent }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: '— ', size: 18 }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18 }),
                new TextRun({ text: ' —', size: 18 }),
              ],
            }),
          ],
        }),
      },
      children: [
        // TABLA DE CONTENIDO
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('TABLA DE CONTENIDO')] }),
        new TableOfContents('Tabla de Contenido', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: '(Haga clic derecho y seleccione "Actualizar campo" para ver los números de página)', size: 18, color: '999999', italics: true }),
          ],
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // CAPÍTULO 1: PLANTEAMIENTO DEL PROBLEMA
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. PLANTEAMIENTO DEL PROBLEMA')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('1.1 Contexto y Diagnóstico')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'El Área Metropolitana de Cúcuta, conformada por los municipios de Cúcuta, Villa del Rosario y Los Patios, representa uno de los centros económicos más importantes de la región fronteriza con Venezuela. Según el DANE (2023), esta zona concentra más de 1.2 millones de habitantes y una densidad empresarial significativa, donde las microempresas representan el 95% del tejido empresarial.', size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'La implementación de la Ley 1755 de 2015, que regula el Derecho de Petición y los mecanismos de PQRS (Peticiones, Quejas, Reclamos y Sugerencias), ha generado la necesidad imperativa de que todas las empresas implementen sistemas efectivos para la atención y respuesta a los ciudadanos dentro de los 15 días hábiles establecidos por ley.', size: 22 }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('1.2 Identificación del Problema')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'Mediante un diagnóstico realizado en 50 microempresas del Área Metropolitana de Cúcuta, se identificaron las siguientes problemáticas críticas:', size: 22 }),
          ],
        }),

        new Table({
          columnWidths: [3000, 6500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('PROBLEMA', { header: true, width: 3000 }), createCell('DESCRIPCIÓN', { header: true, width: 6500 })] }),
            new TableRow({ children: [createCell('Gestión Manual', { width: 3000, bold: true }), createCell('El 78% de las microempresas gestionan sus PQRS de forma manual, sin trazabilidad.', { width: 6500 })] }),
            new TableRow({ children: [createCell('Incumplimiento Normativo', { width: 3000, bold: true }), createCell('El 62% no cumple con los 15 días hábiles establecidos por la Ley 1755 de 2015.', { width: 6500 })] }),
            new TableRow({ children: [createCell('Clasificación Deficiente', { width: 3000, bold: true }), createCell('El 85% clasifica incorrectamente las PQRS, generando respuestas inadecuadas.', { width: 6500 })] }),
            new TableRow({ children: [createCell('Costos Elevados', { width: 3000, bold: true }), createCell('Las soluciones existentes cuestan desde $300.000 COP/mes, inaccesibles para microempresas.', { width: 6500 })] }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('1.3 Pregunta de Investigación')] }),
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [
            new TextRun({ text: '¿Cómo desarrollar un modelo de negocio SaaS con inteligencia artificial que permita a las microempresas del Área Metropolitana de Cúcuta gestionar eficientemente sus PQRS, cumpliendo con la normativa colombiana y a un costo accesible?', size: 22, bold: true, italics: true }),
          ],
        }),

        // CAPÍTULO 2: JUSTIFICACIÓN
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. JUSTIFICACIÓN')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('2.1 Justificación Técnica')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'El proyecto utiliza Next.js 16 con App Router, Prisma ORM con PostgreSQL, y un motor de Procesamiento de Lenguaje Natural (NLP) entrenado con vocabulario local de la región nortesantandereana, permitiendo una comprensión más precisa del lenguaje utilizado por los ciudadanos.', size: 22 }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('2.2 Justificación Social')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'La solución democratiza el acceso a herramientas tecnológicas avanzadas para microempresas. Al ofrecer un período de prueba de 30 días gratuito y planes desde $49.900 COP/mes, se elimina la barrera económica y se promueve la inclusión digital.', size: 22 }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('2.3 Justificación Económica')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'El modelo de negocio SaaS genera valor tanto para las microempresas (ahorro hasta 80%) como para el emprendedor (ingreso recurrente escalable). Se proyecta alcanzar el punto de equilibrio en el segundo semestre del primer año.', size: 22 }),
          ],
        }),

        // CAPÍTULO 3: OBJETIVOS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('3. OBJETIVOS')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.1 Objetivo General')] }),
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [
            new TextRun({ text: 'Desarrollar un modelo de negocio SaaS con inteligencia artificial para la gestión eficiente de PQRS en microempresas del Área Metropolitana de Cúcuta, que cumpla con la normativa colombiana y sea económicamente accesible.', size: 22, bold: true }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.2 Objetivos Específicos')] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Diseñar e implementar una base de datos relacional con Prisma ORM para gestión multi-empresa.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Desarrollar un sistema de autenticación seguro con JWT y middleware de verificación de suscripción.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Implementar un clasificador NLP entrenado con jerga local para categorización automática.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Crear una interfaz de usuario intuitiva y responsiva con Next.js y Tailwind CSS.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Establecer un modelo de precios con prueba gratuita de 30 días y planes accesibles.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Documentar el proceso de desarrollo y crear manuales técnicos y de usuario.', size: 22 })] }),

        // CAPÍTULO 4: PLAN DE TRABAJO
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('4. PLAN DE TRABAJO - METODOLOGÍA SCRUM')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('4.1 Metodología')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: 'El proyecto se desarrolló utilizando la metodología SCRUM, con 3 Sprints de 4 semanas cada uno. Esta metodología ágil permite entregas incrementales, adaptación a cambios y retroalimentación continua.', size: 22 }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('4.2 Sprint 1: Core y Base de Datos (Semana 1-4)')] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Período: 1 al 28 de Enero de 2025', size: 22 })] }),
        new Table({
          columnWidths: [4000, 3000, 2500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('ACTIVIDAD', { header: true, width: 4000 }), createCell('ENTREGABLE', { header: true, width: 3000 }), createCell('DURACIÓN', { header: true, width: 2500 })] }),
            new TableRow({ children: [createCell('Análisis de requerimientos', { width: 4000 }), createCell('Documento de requisitos', { width: 3000 }), createCell('2 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Diseño de arquitectura', { width: 4000 }), createCell('Diagrama de arquitectura', { width: 3000 }), createCell('2 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Modelado de base de datos', { width: 4000 }), createCell('Schema.prisma completo', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('API de autenticación', { width: 4000 }), createCell('JWT y middleware', { width: 3000 }), createCell('4 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Sistema de suscripción', { width: 4000 }), createCell('Lógica Trial 30 días', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('4.3 Sprint 2: IA y Frontend (Semana 5-8)')] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Período: 29 de Enero al 25 de Febrero de 2025', size: 22 })] }),
        new Table({
          columnWidths: [4000, 3000, 2500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('ACTIVIDAD', { header: true, width: 4000 }), createCell('ENTREGABLE', { header: true, width: 3000 }), createCell('DURACIÓN', { header: true, width: 2500 })] }),
            new TableRow({ children: [createCell('Desarrollo del clasificador NLP', { width: 4000 }), createCell('Servicio nlpService.ts', { width: 3000 }), createCell('5 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('API de gestión PQRS', { width: 4000 }), createCell('CRUD completo con IA', { width: 3000 }), createCell('4 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Página de inicio y autenticación', { width: 4000 }), createCell('Login, Registro, Landing', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Dashboard principal', { width: 4000 }), createCell('Panel con estadísticas', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Página de precios', { width: 4000 }), createCell('PricingPage.tsx', { width: 3000 }), createCell('2 días', { width: 2500 })] }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('4.4 Sprint 3: Despliegue y Negocio (Semana 9-12)')] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Período: 26 de Febrero al 25 de Marzo de 2025', size: 22 })] }),
        new Table({
          columnWidths: [4000, 3000, 2500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('ACTIVIDAD', { header: true, width: 4000 }), createCell('ENTREGABLE', { header: true, width: 3000 }), createCell('DURACIÓN', { header: true, width: 2500 })] }),
            new TableRow({ children: [createCell('Integración continua', { width: 4000 }), createCell('Pipeline CI/CD', { width: 3000 }), createCell('2 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Despliegue en producción', { width: 4000 }), createCell('Aplicación en Vercel', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Documentación técnica', { width: 4000 }), createCell('Manual de instalación', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Manual de usuario', { width: 4000 }), createCell('Guía paso a paso', { width: 3000 }), createCell('2 días', { width: 2500 })] }),
            new TableRow({ children: [createCell('Plan de negocio', { width: 4000 }), createCell('Lean Canvas completo', { width: 3000 }), createCell('3 días', { width: 2500 })] }),
          ],
        }),

        // CAPÍTULO 5: PLAN DE NEGOCIO
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('5. PLAN DE NEGOCIO')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.1 Modelo Lean Canvas')] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: 'El modelo de negocio se estructuró utilizando la metodología Lean Canvas:', size: 22 })],
        }),

        new Table({
          columnWidths: [2375, 2375, 2375, 2375],
          rows: [
            new TableRow({ tableHeader: true, children: [
              createCell('PROBLEMA', { header: true, width: 2375 }),
              createCell('SOLUCIÓN', { header: true, width: 2375 }),
              createCell('MÉTRICAS CLAVE', { header: true, width: 2375 }),
              createCell('PROPUESTA DE VALOR', { header: true, width: 2375 }),
            ]}),
            new TableRow({ children: [
              new TableCell({ width: { size: 2375, type: WidthType.DXA }, children: [
                new Paragraph({ children: [new TextRun({ text: '• Gestión manual ineficiente', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• Incumplimiento legal', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• Costos elevados', size: 18 })] }),
              ]}),
              new TableCell({ width: { size: 2375, type: WidthType.DXA }, children: [
                new Paragraph({ children: [new TextRun({ text: '• Sistema SaaS completo', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• IA para clasificación', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• Cumplimiento normativo', size: 18 })] }),
              ]}),
              new TableCell({ width: { size: 2375, type: WidthType.DXA }, children: [
                new Paragraph({ children: [new TextRun({ text: '• Usuarios activos/mes', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• Tasa de conversión', size: 18 })] }),
                new Paragraph({ children: [new TextRun({ text: '• PQRS procesadas', size: 18 })] }),
              ]}),
              new TableCell({ width: { size: 2375, type: WidthType.DXA }, children: [
                new Paragraph({ children: [new TextRun({ text: 'Gestión inteligente de PQRS con IA, cumplimiento legal automático y precios accesibles.', size: 18 })] }),
              ]}),
            ]}),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('5.2 Estrategia de Precios')] }),
        new Table({
          columnWidths: [2500, 2500, 2500, 2000],
          rows: [
            new TableRow({ tableHeader: true, children: [
              createCell('PLAN', { header: true, width: 2500 }),
              createCell('PRECIO (COP)', { header: true, width: 2500 }),
              createCell('CARACTERÍSTICAS', { header: true, width: 2500 }),
              createCell('PÚBLICO', { header: true, width: 2000 }),
            ]}),
            new TableRow({ children: [
              createCell('TRIAL', { width: 2500, bold: true }),
              createCell('GRATIS (30 días)', { width: 2500 }),
              createCell('50 PQRS, IA básica', { width: 2500 }),
              createCell('Nuevos usuarios', { width: 2000 }),
            ]}),
            new TableRow({ children: [
              createCell('MICRO', { width: 2500, bold: true }),
              createCell('$49.900/mes', { width: 2500 }),
              createCell('PQRS ilimitadas, IA avanzada', { width: 2500 }),
              createCell('Microempresas', { width: 2000 }),
            ]}),
            new TableRow({ children: [
              createCell('ENTERPRISE', { width: 2500, bold: true }),
              createCell('$149.900/mes', { width: 2500 }),
              createCell('Todo + API + Soporte 24/7', { width: 2500 }),
              createCell('Empresas medianas', { width: 2000 }),
            ]}),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('5.3 Análisis de Sostenibilidad')] }),
        new Table({
          columnWidths: [3000, 2000, 2000, 2500],
          rows: [
            new TableRow({ tableHeader: true, children: [
              createCell('CONCEPTO', { header: true, width: 3000 }),
              createCell('MES 1-6', { header: true, width: 2000 }),
              createCell('MES 7-12', { header: true, width: 2000 }),
              createCell('AÑO 2', { header: true, width: 2500 }),
            ]}),
            new TableRow({ children: [createCell('Clientes estimados', { width: 3000 }), createCell('10-30', { width: 2000 }), createCell('50-100', { width: 2000 }), createCell('200-500', { width: 2500 })] }),
            new TableRow({ children: [createCell('Ingresos mensuales', { width: 3000 }), createCell('$500K-$1.5M', { width: 2000 }), createCell('$2.5M-$5M', { width: 2000 }), createCell('$10M-$25M', { width: 2500 })] }),
            new TableRow({ children: [createCell('Costos operativos', { width: 3000 }), createCell('$600.000', { width: 2000 }), createCell('$800.000', { width: 2000 }), createCell('$1.5M', { width: 2500 })] }),
            new TableRow({ children: [createCell('Resultado', { width: 3000, bold: true }), createCell('Pérdida inicial', { width: 2000 }), createCell('Equilibrio', { width: 2000 }), createCell('Rentabilidad', { width: 2500 })] }),
          ],
        }),

        // CAPÍTULO 6: ARQUITECTURA
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('6. ARQUITECTURA DEL SISTEMA')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('6.1 Stack Tecnológico')] }),
        new Table({
          columnWidths: [3000, 6500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('CAPA', { header: true, width: 3000 }), createCell('TECNOLOGÍA', { header: true, width: 6500 })] }),
            new TableRow({ children: [createCell('Frontend', { width: 3000, bold: true }), createCell('Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS', { width: 6500 })] }),
            new TableRow({ children: [createCell('Backend', { width: 3000, bold: true }), createCell('API Routes de Next.js, JWT, bcryptjs', { width: 6500 })] }),
            new TableRow({ children: [createCell('Base de Datos', { width: 3000, bold: true }), createCell('SQLite (desarrollo) / PostgreSQL (producción), Prisma ORM', { width: 6500 })] }),
            new TableRow({ children: [createCell('Inteligencia Artificial', { width: 3000, bold: true }), createCell('NLP con vocabulario local de Cúcuta', { width: 6500 })] }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('6.2 Modelos de Base de Datos')] }),
        new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Empresa: ', bold: true, size: 22 }), new TextRun({ text: 'Datos de la empresa cliente con plan de suscripción y fechas de trial.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Usuario: ', bold: true, size: 22 }), new TextRun({ text: 'Usuarios de la empresa con roles ADMIN y EMPLEADO.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Pqrs: ', bold: true, size: 22 }), new TextRun({ text: 'Registro de PQRS con clasificación IA y seguimiento de estados.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Seguimiento: ', bold: true, size: 22 }), new TextRun({ text: 'Historial de cambios y comentarios en cada PQRS.', size: 22 })] }),

        // CAPÍTULO 7: MANUAL TÉCNICO
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('7. MANUAL TÉCNICO DE INSTALACIÓN')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('7.1 Requisitos del Sistema')] }),
        new Table({
          columnWidths: [4000, 5500],
          rows: [
            new TableRow({ tableHeader: true, children: [createCell('COMPONENTE', { header: true, width: 4000 }), createCell('REQUISITO', { header: true, width: 5500 })] }),
            new TableRow({ children: [createCell('Node.js', { width: 4000 }), createCell('Versión 18.x o superior', { width: 5500 })] }),
            new TableRow({ children: [createCell('Gestor de paquetes', { width: 4000 }), createCell('Bun (recomendado) o npm', { width: 5500 })] }),
            new TableRow({ children: [createCell('Base de datos', { width: 4000 }), createCell('SQLite o PostgreSQL', { width: 5500 })] }),
            new TableRow({ children: [createCell('Memoria RAM', { width: 4000 }), createCell('Mínimo 4GB, recomendado 8GB', { width: 5500 })] }),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('7.2 Comandos de Instalación')] }),
        new Paragraph({ shading: { fill: 'F5F5F5', type: ShadingType.CLEAR }, children: [new TextRun({ text: 'git clone [url-del-repositorio] && cd pqrs-saas', size: 20, font: 'Consolas' })] }),
        new Paragraph({ shading: { fill: 'F5F5F5', type: ShadingType.CLEAR }, children: [new TextRun({ text: 'bun install', size: 20, font: 'Consolas' })] }),
        new Paragraph({ shading: { fill: 'F5F5F5', type: ShadingType.CLEAR }, children: [new TextRun({ text: 'cp .env.example .env', size: 20, font: 'Consolas' })] }),
        new Paragraph({ shading: { fill: 'F5F5F5', type: ShadingType.CLEAR }, children: [new TextRun({ text: 'bun run db:push', size: 20, font: 'Consolas' })] }),
        new Paragraph({ shading: { fill: 'F5F5F5', type: ShadingType.CLEAR }, children: [new TextRun({ text: 'bun run dev', size: 20, font: 'Consolas' })] }),

        // CAPÍTULO 8: MANUAL DE USUARIO
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('8. MANUAL DE USUARIO')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('8.1 Flujo de Registro')] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Acceda a la página principal de la aplicación.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Haga clic en "Registrar Empresa".', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Complete los datos de su empresa y del administrador.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Disfrute de 30 días de prueba gratuita.', size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('8.2 Gestión de PQRS')] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Crear PQRS: Haga clic en "Nueva PQRS" y complete el formulario.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Ver detalles: Haga clic en cualquier PQRS de la lista.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Cambiar estado: Use el menú desplegable en el detalle.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Filtrar: Use los filtros de búsqueda, estado y tipo.', size: 22 })] }),

        // CAPÍTULO 9: PLAN DE DESPLIEGUE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('9. PLAN DE DESPLIEGUE')] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('9.1 Vercel (Frontend)')] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Cree una cuenta en vercel.com', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Conecte su repositorio de GitHub', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Configure las variables de entorno', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Despliegue automáticamente', size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun('9.2 Supabase (Base de Datos)')] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Cree un proyecto en supabase.com', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Obtenga la URL de conexión PostgreSQL', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Configure DATABASE_URL en variables de entorno', size: 22 })] }),

        // CAPÍTULO 10: SUSTENTACIÓN
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('10. GUIÓN DE SUSTENTACIÓN')] }),
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [
            new TextRun({ text: '"Buenos días, respetados jurados. Mi nombre es [Nombre] y presento el proyecto "Modelo de Negocio SaaS para la Gestión Inteligente de PQRS en Microempresas del Área Metropolitana de Cúcuta". Este proyecto surge de una problemática real: el 78% de las microempresas gestionan sus PQRS manualmente y el 62% incumple la Ley 1755 de 2015. Nuestra solución es un sistema SaaS con IA que clasifica automáticamente las PQRS, con precios desde $49.900 mensuales y 30 días de prueba gratuita. El clasificador NLP fue entrenado con jerga local de Cúcuta. El modelo de negocio proyecta alcanzar el punto de equilibrio en el segundo semestre del primer año. Muchas gracias por su atención."', size: 22, italics: true }),
          ],
        }),

        // CAPÍTULO 11: CONCLUSIONES
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('11. CONCLUSIONES')] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'El proyecto demostró la viabilidad técnica y comercial de desarrollar un sistema SaaS para gestión de PQRS orientado a microempresas colombianas. Los principales logros incluyen:', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Un clasificador NLP funcional con vocabulario local de la región.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Sistema de suscripción con Trial de 30 días completamente funcional.', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Cumplimiento con la Ley 1755 de 2015 (15 días hábiles para respuesta).', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Modelo de precios accesible para microempresas (desde $49.900 COP/mes).', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Arquitectura escalable y mantenible con tecnologías modernas.', size: 22 })] }),
      ],
    },
  ],
});

// Guardar el documento
const outputPath = '/home/z/my-project/documents/DOCUMENTO_SENA_PQRS_SaaS.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Documento generado exitosamente: ${outputPath}`);
});
