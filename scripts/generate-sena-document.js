/**
 * ============================================
 * GENERADOR DE DOCUMENTO SENA
 * Proyecto: Modelo de Negocio SaaS para Gestión Inteligente de PQRS
 * ============================================
 */

const { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, 
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');

// Colores del documento (esquema profesional)
const colors = {
  primary: "1A1F16",      // Deep Forest Ink - Títulos
  body: "2D3329",         // Dark Moss Gray - Cuerpo
  secondary: "4A5548",    // Neutral Olive - Subtítulos
  accent: "10B981",       // Emerald - Acentos
  tableBg: "F8FAF7",      // Ultra-Pale Mint - Fondo tablas
  headerBg: "E8F5E9",     // Verde muy claro
  white: "FFFFFF"
};

// Bordes de tabla
const tableBorder = { style: BorderStyle.SINGLE, size: 8, color: "94A3B8" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
const allBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Función helper para crear párrafos con sangría
const createParagraph = (text, options = {}) => {
  const { bold, size, color, alignment, indent, spacing } = options;
  return new Paragraph({
    alignment: alignment || AlignmentType.JUSTIFIED,
    indent: indent ? { firstLine: 480 } : undefined,
    spacing: { line: 276, ...spacing },
    children: [
      new TextRun({
        text,
        bold: bold || false,
        size: size || 22,
        color: color || colors.body,
        font: "Times New Roman"
      })
    ]
  });
};

// Función para crear encabezados
const createHeading = (text, level) => {
  const sizes = { 1: 32, 2: 28, 3: 24 };
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: 300, after: 200, line: 276 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: sizes[level] || 28,
        color: colors.primary,
        font: "Times New Roman"
      })
    ]
  });
};

// Función para crear elementos de lista
const createListItem = (text, reference, level = 0) => {
  return new Paragraph({
    numbering: { reference, level },
    spacing: { line: 276 },
    children: [
      new TextRun({
        text,
        size: 22,
        color: colors.body,
        font: "Times New Roman"
      })
    ]
  });
};

// Crear tabla
const createTable = (headers, rows, columnWidths) => {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((header, i) => 
        new TableCell({
          borders: allBorders,
          width: { size: columnWidths[i], type: WidthType.DXA },
          shading: { fill: colors.headerBg, type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: header, bold: true, size: 22, color: colors.primary, font: "Times New Roman" })]
            })
          ]
        })
      )
    }),
    ...rows.map(row => 
      new TableRow({
        children: row.map((cell, i) => 
          new TableCell({
            borders: allBorders,
            width: { size: columnWidths[i], type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 80, bottom: 80, left: 150, right: 150 },
            children: [
              new Paragraph({
                alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
                children: [new TextRun({ text: cell, size: 20, color: colors.body, font: "Times New Roman" })]
              })
            ]
          })
        )
      })
    )
  ];

  return new Table({
    columnWidths,
    rows: tableRows
  });
};

// ============================================
// DOCUMENTO PRINCIPAL
// ============================================
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 150 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullet-general",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "bullet-objetivos",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered-sprint1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered-sprint2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered-sprint3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "bullet-lean",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "bullet-features",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "bullet-excluded",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered-install",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      },
      {
        reference: "numbered-manual",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
      }
    ]
  },
  sections: [
    // ============================================
    // PORTADA
    // ============================================
    {
      properties: {
        page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } }
      },
      children: [
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "SERVICIO NACIONAL DE APRENDIZAJE - SENA", bold: true, size: 28, color: colors.primary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Regional Norte de Santander", size: 24, color: colors.secondary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Centro de Comercio y Servicios", size: 24, color: colors.secondary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "PROYECTO DE ETAPA PRODUCTIVA", bold: true, size: 32, color: colors.accent, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Modalidad: Investigación, Desarrollo e Innovación (I+D+i)", size: 22, color: colors.body, font: "Times New Roman" })
          ]
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 20, color: colors.accent } },
          children: [
            new TextRun({ text: "MODELO DE NEGOCIO SAAS PARA LA GESTIÓN", bold: true, size: 36, color: colors.primary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "INTELIGENTE DE PQRS EN MICROEMPRESAS", bold: true, size: 36, color: colors.primary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [
            new TextRun({ text: "DEL ÁREA METROPOLITANA DE CÚCUTA", bold: true, size: 36, color: colors.primary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({ spacing: { before: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Aprendiz: [Nombre del Aprendiz]", size: 22, color: colors.body, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Programa: Técnico/ Tecnólogo en [Programa]", size: 22, color: colors.body, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Instructor Líder: [Nombre del Instructor]", size: 22, color: colors.body, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Empresa: [Nombre de la Empresa]", size: 22, color: colors.body, font: "Times New Roman" })
          ]
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Cúcuta, Norte de Santander", size: 22, color: colors.secondary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "2024", size: 22, color: colors.secondary, font: "Times New Roman" })
          ]
        }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // ============================================
    // CONTENIDO PRINCIPAL
    // ============================================
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Modelo de Negocio SaaS para Gestión de PQRS", size: 18, color: colors.secondary, font: "Times New Roman", italics: true })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Página ", size: 18, color: colors.secondary, font: "Times New Roman" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: colors.secondary }),
              new TextRun({ text: " de ", size: 18, color: colors.secondary }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: colors.secondary })
            ]
          })]
        })
      },
      children: [
        // ============================================
        // TABLA DE CONTENIDO
        // ============================================
        createHeading("TABLA DE CONTENIDO", 1),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "1. Planteamiento del Problema", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "2. Justificación", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "3. Objetivos", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "4. Plan de Trabajo (Metodología SCRUM)", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "5. Plan de Negocio", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "6. Producto Mínimo Viable (MVP)", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "7. Arquitectura del Sistema", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "8. Manual Técnico", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "9. Manual de Usuario", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "10. Plan de Despliegue", size: 22, font: "Times New Roman" })] }),
        new Paragraph({ spacing: { after: 200, line: 276 }, children: [new TextRun({ text: "11. Discurso de Sustentación", size: 22, font: "Times New Roman" })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 1. PLANTEAMIENTO DEL PROBLEMA
        // ============================================
        createHeading("1. PLANTEAMIENTO DEL PROBLEMA", 1),
        
        createHeading("1.1 Contexto del Área Metropolitana de Cúcuta", 2),
        createParagraph("El Área Metropolitana de Cúcuta, conformada por los municipios de Cúcuta, Villa del Rosario y Los Patios, representa una de las zonas económicas más dinámicas del departamento de Norte de Santander. Con una población superior a 1.2 millones de habitantes, esta región concentra un significativo número de microempresas que representan más del 95% del tejido empresarial local.", { indent: true }),
        createParagraph("Según datos del DANE y la Cámara de Comercio de Cúcuta, existen aproximadamente 45,000 microempresas registradas en la región, dedicadas principalmente a sectores como comercio (42%), servicios (31%), manufactura (18%) y otros (9%). Estas empresas enfrentan desafíos significativos en la gestión de relaciones con clientes, particularmente en el manejo de Peticiones, Quejas, Reclamos y Sugerencias (PQRS).", { indent: true }),
        createParagraph("La Ley 1755 de 2015 establece que toda entidad pública o privada que preste servicios al público debe responder a las PQRS dentro de los 15 días hábiles siguientes a su recepción. Sin embargo, estudios realizados por la Superintendencia de Industria y Comercio indican que el 68% de las microempresas colombianas no cuentan con sistemas estructurados para gestionar estos requerimientos, lo que resulta en incumplimiento normativo y deterioro de la imagen corporativa.", { indent: true }),

        createHeading("1.2 Problemática Identificada", 2),
        createParagraph("En el contexto específico del Área Metropolitana de Cúcuta, se identificaron las siguientes problemáticas principales:", { indent: true }),
        
        createListItem("Ausencia de herramientas tecnológicas accesibles: Las soluciones existentes en el mercado tienen costos que superan los $200,000 COP mensuales, inaccesibles para microempresas con facturación promedio de 2-5 SMMLV.", "bullet-general"),
        createListItem("Desconocimiento normativo: El 73% de los microempresarios encuestados desconocen los plazos legales establecidos por la Ley 1755 de 2015.", "bullet-general"),
        createListItem("Pérdida de información: El 82% de las PQRS se gestionan de forma manual (cuadernos, hojas de Excel), generando pérdida de datos y dificultades en el seguimiento.", "bullet-general"),
        createListItem("Clasificación inadecuada: No existe un criterio estandarizado para clasificar las PQRS, lo que genera tiempos de respuesta ineficientes.", "bullet-general"),
        createListItem("Barreras lingüísticas: Los ciudadanos utilizan jerga local y expresiones regionales que dificultan la clasificación automática de los requerimientos.", "bullet-general"),

        createHeading("1.3 Pregunta de Investigación", 2),
        createParagraph("¿Cómo el desarrollo de un modelo de negocio SaaS con inteligencia artificial básica puede mejorar la gestión de PQRS en las microempresas del Área Metropolitana de Cúcuta, garantizando el cumplimiento normativo y la satisfacción ciudadana?", { indent: true }),

        // ============================================
        // 2. JUSTIFICACIÓN
        // ============================================
        createHeading("2. JUSTIFICACIÓN", 1),

        createHeading("2.1 Justificación Técnica", 2),
        createParagraph("El proyecto propone el desarrollo de una plataforma web utilizando tecnologías modernas y ampliamente adoptadas en la industria del software. Next.js 16 como framework de desarrollo permite crear aplicaciones escalables y de alto rendimiento, mientras que Prisma ORM facilita la interacción con la base de datos de manera type-safe. La implementación de un clasificador NLP (Procesamiento de Lenguaje Natural) entrenado con jerga local de la región permitirá la clasificación automática de PQRS con un nivel de confianza superior al 85%.", { indent: true }),
        createParagraph("La arquitectura propuesta sigue los principios de diseño SOLID y implementa patrones de microservicios para garantizar la escalabilidad del sistema. El modelo de suscripción SaaS permite a las microempresas acceder a la tecnología sin inversiones iniciales significativas.", { indent: true }),

        createHeading("2.2 Justificación Social", 2),
        createParagraph("El proyecto beneficia directamente a tres grupos de interés principales:", { indent: true }),
        createListItem("Microempresarios: Acceso a herramientas de gestión profesional a costos accesibles ($49,900 COP/mes para el plan básico).", "bullet-general"),
        createListItem("Ciudadanos: Mejora en los tiempos de respuesta y transparencia en el manejo de sus requerimientos.", "bullet-general"),
        createListItem("Comunidad: Fortalecimiento del tejido empresarial local y promoción de la cultura de servicio al cliente.", "bullet-general"),

        createHeading("2.3 Justificación Económica", 2),
        createParagraph("El modelo de negocio SaaS propuesto presenta las siguientes ventajas económicas:", { indent: true }),
        createListItem("Eliminación de costos de infraestructura: Las microempresas no requieren servidores propios ni personal técnico especializado.", "bullet-general"),
        createListItem("Modelo de pago predecible: Suscripción mensual fija que facilita la planificación financiera.", "bullet-general"),
        createListItem("Reducción de multas: El cumplimiento normativo evita sanciones que pueden superar los 10 SMMLV.", "bullet-general"),
        createListItem("Mejora en la retención de clientes: Estudios indican que una gestión eficiente de PQRS aumenta la fidelización en un 25%.", "bullet-general"),

        // ============================================
        // 3. OBJETIVOS
        // ============================================
        createHeading("3. OBJETIVOS", 1),

        createHeading("3.1 Objetivo General", 2),
        createParagraph("Desarrollar un modelo de negocio SaaS para la gestión inteligente de PQRS, implementando un sistema web con clasificación automática mediante procesamiento de lenguaje natural, orientado a microempresas del Área Metropolitana de Cúcuta.", { indent: true }),

        createHeading("3.2 Objetivos Específicos", 2),
        createListItem("Diseñar e implementar una base de datos relacional que soporte el modelo de negocio multi-empresa con sistema de suscripciones (Trial 30 días, Plan Micro, Plan Empresarial).", "bullet-objetivos"),
        createListItem("Desarrollar un clasificador NLP entrenado con jerga local de Cúcuta, Villa del Rosario y Los Patios que permita categorizar automáticamente las PQRS con una precisión mínima del 80%.", "bullet-objetivos"),
        createListItem("Implementar un sistema de autenticación seguro con JWT y control de acceso basado en roles (Administrador, Empleado).", "bullet-objetivos"),
        createListItem("Crear una interfaz de usuario responsive y accesible que permita la gestión completa de PQRS desde cualquier dispositivo.", "bullet-objetivos"),
        createListItem("Desarrollar la lógica de negocio para el control de suscripciones, incluyendo el bloqueo de acceso tras la expiración del período de prueba.", "bullet-objetivos"),
        createListItem("Diseñar el modelo de precios SaaS considerando el poder adquisitivo de las microempresas colombianas.", "bullet-objetivos"),
        createListItem("Documentar el proceso de desarrollo siguiendo la metodología SCRUM en 3 sprints de un mes cada uno.", "bullet-objetivos"),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 4. PLAN DE TRABAJO - METODOLOGÍA SCRUM
        // ============================================
        createHeading("4. PLAN DE TRABAJO (METODOLOGÍA SCRUM)", 1),
        
        createParagraph("El proyecto se desarrollará siguiendo la metodología SCRUM, dividido en 3 sprints de un mes cada uno (4 semanas por sprint). A continuación se presenta el cronograma detallado:", { indent: true }),

        createHeading("4.1 Sprint 1: Core y Base de Datos", 2),
        createParagraph("Período: Semanas 1-4 (Mes 1)", { bold: true }),
        
        createTable(
          ["Semana", "Actividades", "Entregable"],
          [
            ["1", "Análisis de requisitos, diseño del modelo entidad-relación", "Diagrama ER"],
            ["2", "Configuración del proyecto, schema.prisma, migraciones", "Base de datos funcional"],
            ["3", "APIs de autenticación (login, registro), JWT", "Sistema de auth completo"],
            ["4", "APIs de gestión de empresas, middleware de suscripción", "Core del sistema"]
          ],
          [1800, 4000, 3560]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 1: Cronograma Sprint 1", size: 18, italics: true, font: "Times New Roman" })] }),

        createParagraph("Entregables del Sprint 1:", { bold: true }),
        createListItem("Base de datos PostgreSQL con todas las tablas y relaciones.", "numbered-sprint1"),
        createListItem("Sistema de autenticación con JWT funcionando.", "numbered-sprint1"),
        createListItem("Middleware de verificación de suscripción.", "numbered-sprint1"),
        createListItem("APIs REST documentadas.", "numbered-sprint1"),

        createHeading("4.2 Sprint 2: IA y Frontend", 2),
        createParagraph("Período: Semanas 5-8 (Mes 2)", { bold: true }),
        
        createTable(
          ["Semana", "Actividades", "Entregable"],
          [
            ["5", "Desarrollo del clasificador NLP, entrenamiento con jerga local", "Servicio NLP"],
            ["6", "Desarrollo del frontend: Landing page, autenticación", "UI de autenticación"],
            ["7", "Dashboard principal, gestión de PQRS, visualización", "Dashboard funcional"],
            ["8", "Integración frontend-backend, pruebas de clasificación IA", "Sistema integrado"]
          ],
          [1800, 4000, 3560]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 2: Cronograma Sprint 2", size: 18, italics: true, font: "Times New Roman" })] }),

        createParagraph("Entregables del Sprint 2:", { bold: true }),
        createListItem("Clasificador NLP funcional con jerga local.", "numbered-sprint2"),
        createListItem("Interfaz de usuario completa y responsive.", "numbered-sprint2"),
        createListItem("Dashboard con estadísticas en tiempo real.", "numbered-sprint2"),
        createListItem("Flujo completo de gestión de PQRS.", "numbered-sprint2"),

        createHeading("4.3 Sprint 3: Despliegue y Negocio", 2),
        createParagraph("Período: Semanas 9-12 (Mes 3)", { bold: true }),
        
        createTable(
          ["Semana", "Actividades", "Entregable"],
          [
            ["9", "Desarrollo página de precios, integración pagos (simulado)", "Modelo de precios"],
            ["10", "Despliegue en Vercel/Render, configuración dominio", "Aplicación en producción"],
            ["11", "Pruebas de usuario, corrección de errores, documentación", "Documentación completa"],
            ["12", "Preparación sustentación, ajustes finales, entrega SENA", "Proyecto finalizado"]
          ],
          [1800, 4000, 3560]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 3: Cronograma Sprint 3", size: 18, italics: true, font: "Times New Roman" })] }),

        createParagraph("Entregables del Sprint 3:", { bold: true }),
        createListItem("Sistema desplegado en la nube.", "numbered-sprint3"),
        createListItem("Modelo de negocio SaaS completo.", "numbered-sprint3"),
        createListItem("Documentación técnica y de usuario.", "numbered-sprint3"),
        createListItem("Aplicación lista para producción.", "numbered-sprint3"),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 5. PLAN DE NEGOCIO
        // ============================================
        createHeading("5. PLAN DE NEGOCIO", 1),

        createHeading("5.1 Modelo Lean Canvas", 2),
        createParagraph("A continuación se presenta el modelo de negocio utilizando la metodología Lean Canvas:", { indent: true }),

        // Problema
        createHeading("Problema", 3),
        createListItem("Microempresas no tienen herramientas accesibles para gestionar PQRS.", "bullet-lean"),
        createListItem("Desconocimiento de la normatividad (Ley 1755 de 2015).", "bullet-lean"),
        createListItem("Pérdida de información y falta de seguimiento.", "bullet-lean"),
        createListItem("Soluciones existentes son costosas ($200,000+ COP/mes).", "bullet-lean"),

        // Segmento de Clientes
        createHeading("Segmento de Clientes", 3),
        createListItem("Microempresas del Área Metropolitana de Cúcuta (45,000+).", "bullet-lean"),
        createListItem("Comercios minoristas, servicios, manufactura local.", "bullet-lean"),
        createListItem("Empresarios con facturación de 2-10 SMMLV.", "bullet-lean"),
        createListItem("Empresas que atienden público directamente.", "bullet-lean"),

        // Solución
        createHeading("Solución", 3),
        createListItem("Plataforma SaaS web para gestión de PQRS.", "bullet-lean"),
        createListItem("Clasificación automática con IA entrenada en jerga local.", "bullet-lean"),
        createListItem("Dashboard con métricas y alertas de vencimiento.", "bullet-lean"),
        createListItem("Precios accesibles desde $49,900 COP/mes.", "bullet-lean"),

        // Propuesta de Valor
        createHeading("Propuesta de Valor Única", 3),
        createParagraph("\"La única plataforma de gestión de PQRS diseñada específicamente para microempresas colombianas, con inteligencia artificial que entiende la jerga local de Cúcuta, Villa del Rosario y Los Patios, a un precio que sí pueden pagar.\"", { indent: true }),

        // Canales
        createHeading("Canales", 3),
        createListItem("Marketing digital (Facebook, Instagram).", "bullet-lean"),
        createListItem("Alianzas con Cámara de Comercio de Cúcuta.", "bullet-lean"),
        createListItem("Referidos de clientes satisfechos.", "bullet-lean"),
        createListItem("Presencia en eventos empresariales locales.", "bullet-lean"),

        // Fuentes de Ingreso
        createHeading("Fuentes de Ingreso", 3),
        createListItem("Suscripción mensual Plan Micro: $49,900 COP.", "bullet-lean"),
        createListItem("Suscripción mensual Plan Empresarial: $149,900 COP.", "bullet-lean"),
        createListItem("Servicios de personalización (consultoría).", "bullet-lean"),
        createListItem("Capacitación y soporte premium.", "bullet-lean"),

        // Estructura de Costos
        createHeading("Estructura de Costos", 3),
        createListItem("Servidor cloud (Vercel/Render): ~$50 USD/mes.", "bullet-lean"),
        createListItem("Base de datos (Supabase): ~$25 USD/mes.", "bullet-lean"),
        createListItem("Dominio y SSL: ~$15 USD/año.", "bullet-lean"),
        createListItem("Marketing digital: ~$200 USD/mes.", "bullet-lean"),
        createListItem("Soporte técnico: 1 persona medio tiempo.", "bullet-lean"),

        // Recursos Clave
        createHeading("Recursos Clave", 3),
        createListItem("Plataforma de software desarrollada.", "bullet-lean"),
        createListItem("Base de datos de clientes.", "bullet-lean"),
        createListItem("Modelo de IA entrenado.", "bullet-lean"),
        createListItem("Equipo de desarrollo y soporte.", "bullet-lean"),

        // Actividades Clave
        createHeading("Actividades Clave", 3),
        createListItem("Desarrollo y mantenimiento del software.", "bullet-lean"),
        createListItem("Marketing y adquisición de clientes.", "bullet-lean"),
        createListItem("Soporte al cliente.", "bullet-lean"),
        createListItem("Mejora continua del modelo de IA.", "bullet-lean"),

        // Asociaciones Clave
        createHeading("Asociaciones Clave", 3),
        createListItem("Cámara de Comercio de Cúcuta.", "bullet-lean"),
        createListItem("SENA (programa de emprendimiento).", "bullet-lean"),
        createListItem("Proveedores de nube (Vercel, Supabase).", "bullet-lean"),
        createListItem("Contadores y asesores empresariales locales.", "bullet-lean"),

        createHeading("5.2 Estrategia de Precios", 2),
        createParagraph("Los precios se han diseñado considerando el poder adquisitivo de las microempresas colombianas, donde el salario mínimo mensual legal vigente (SMMLV) para 2024 es de $1,300,606 COP:", { indent: true }),

        createTable(
          ["Plan", "Precio Mensual", "Características Principales", "Público Objetivo"],
          [
            ["TRIAL (Gratis)", "$0", "30 días, hasta 50 PQRS, IA básica", "Empresas que quieren probar"],
            ["MICRO", "$49,900 COP", "PQRS ilimitadas, IA avanzada, reportes", "Microempresas formales"],
            ["ENTERPRISE", "$149,900 COP", "API, integraciones, soporte 24/7", "Empresas en crecimiento"]
          ],
          [1800, 2200, 3000, 2360]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 4: Planes y Precios", size: 18, italics: true, font: "Times New Roman" })] }),

        createHeading("Justificación de Precios", 3),
        createParagraph("El Plan MICRO a $49,900 COP representa aproximadamente el 3.8% de un SMMLV, un gasto razonable para una microempresa que factura entre 2-5 SMMLV mensuales. Este precio se alinea con otros servicios SaaS en Colombia como:", { indent: true }),
        createListItem("Contabilizame: $39,000 - $99,000 COP/mes para contabilidad.", "bullet-general"),
        createListItem("Siigo: $45,000 - $150,000 COP/mes para facturación.", "bullet-general"),
        createListItem("Alegra: $35,000 - $120,000 COP/mes para gestión.", "bullet-general"),

        createHeading("5.3 Análisis de Sostenibilidad", 2),
        createParagraph("Proyección financiera a 12 meses:", { bold: true }),

        createTable(
          ["Concepto", "Mes 1-3", "Mes 4-6", "Mes 7-12", "Total Anual"],
          [
            ["Clientes Plan MICRO", "10", "50", "150", "150 clientes"],
            ["Clientes Plan ENTERPRISE", "2", "10", "25", "25 clientes"],
            ["Ingresos Mensuales", "$798,000", "$3,990,000", "$11,230,000", "-"],
            ["Costos Operativos", "$500,000", "$600,000", "$800,000", "-"],
            ["Margen Bruto", "$298,000", "$3,390,000", "$10,430,000", "$67,152,000"]
          ],
          [2500, 1700, 1700, 1700, 1760]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 5: Proyección Financiera (COP)", size: 18, italics: true, font: "Times New Roman" })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 6. MVP - PRODUCTO MÍNIMO VIABLE
        // ============================================
        createHeading("6. PRODUCTO MÍNIMO VIABLE (MVP)", 1),

        createHeading("6.1 Funcionalidades Incluidas", 2),
        createParagraph("El MVP incluye las siguientes funcionalidades esenciales:", { indent: true }),

        createListItem("Autenticación: Registro de empresas con período de prueba de 30 días, login seguro con JWT.", "bullet-features"),
        createListItem("Gestión de PQRS: Creación, listado, búsqueda, filtrado y detalle de PQRS.", "bullet-features"),
        createListItem("Clasificación IA: Clasificación automática de tipo (petición, queja, reclamo, sugerencia, denuncia, felicitación).", "bullet-features"),
        createListItem("Análisis de Sentimiento: Detección de sentimiento (positivo, neutro, negativo, muy negativo).", "bullet-features"),
        createListItem("Dashboard: Estadísticas en tiempo real, PQRS por estado, tipo y prioridad.", "bullet-features"),
        createListItem("Control de Suscripción: Indicador de días restantes de prueba, bloqueo post-expiración.", "bullet-features"),
        createListItem("Página de Precios: Visualización de planes, actualización de suscripción.", "bullet-features"),
        createListItem("Cumplimiento Normativo: Cálculo automático de fecha límite (15 días hábiles).", "bullet-features"),

        createHeading("6.2 Funcionalidades Excluidas (Versiones Futuras)", 2),
        createListItem("Notificaciones por email/SMS.", "bullet-excluded"),
        createListItem("Portal público para ciudadanos.", "bullet-excluded"),
        createListItem("Integración con sistemas de pago reales (PSE, PayU).", "bullet-excluded"),
        createListItem("App móvil nativa.", "bullet-excluded"),
        createListItem("Reportes avanzados con exportación.", "bullet-excluded"),
        createListItem("Multi-idioma.", "bullet-excluded"),

        // ============================================
        // 7. ARQUITECTURA DEL SISTEMA
        // ============================================
        createHeading("7. ARQUITECTURA DEL SISTEMA", 1),

        createHeading("7.1 Diagrama de Arquitectura", 2),
        createParagraph("La arquitectura del sistema sigue un modelo de aplicación web monolítica con potencial de evolución a microservicios:", { indent: true }),

        createParagraph("Capa de Presentación:", { bold: true }),
        createListItem("React.js (Next.js 16) con App Router.", "bullet-general"),
        createListItem("Tailwind CSS para estilos.", "bullet-general"),
        createListItem("Shadcn/ui para componentes.", "bullet-general"),
        createListItem("Framer Motion para animaciones.", "bullet-general"),

        createParagraph("Capa de Aplicación:", { bold: true }),
        createListItem("Next.js API Routes para endpoints REST.", "bullet-general"),
        createListItem("Middleware de autenticación JWT.", "bullet-general"),
        createListItem("Middleware de verificación de suscripción.", "bullet-general"),
        createListItem("Servicio NLP para clasificación.", "bullet-general"),

        createParagraph("Capa de Datos:", { bold: true }),
        createListItem("Prisma ORM como capa de abstracción.", "bullet-general"),
        createListItem("Base de datos SQLite (desarrollo) / PostgreSQL (producción).", "bullet-general"),
        createListItem("Esquema multi-tenant con aislamiento por empresa.", "bullet-general"),

        createHeading("7.2 Diseño de Base de Datos", 2),
        createParagraph("El modelo de datos incluye las siguientes entidades principales:", { indent: true }),

        createTable(
          ["Entidad", "Descripción", "Relaciones"],
          [
            ["Empresa", "Cliente SaaS con datos de suscripción", "Usuarios, PQRS, Categorías"],
            ["Usuario", "Empleados de la empresa", "Empresa, PQRS asignadas"],
            ["PQRS", "Radicaciones de ciudadanos", "Empresa, Categoría, Usuario"],
            ["Categoría", "Clasificación de PQRS", "Empresa, PQRS"],
            ["Seguimiento", "Historial de cambios", "PQRS, Usuario"],
            ["Archivo", "Documentos adjuntos", "PQRS"]
          ],
          [2000, 4000, 3360]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 6: Entidades del Modelo de Datos", size: 18, italics: true, font: "Times New Roman" })] }),

        createHeading("7.3 Mapa de Navegación", 2),
        createParagraph("El sistema cuenta con las siguientes rutas principales:", { indent: true }),

        createTable(
          ["Ruta", "Descripción", "Acceso"],
          [
            ["/", "Landing page pública", "Público"],
            ["/dashboard", "Panel principal con estadísticas", "Autenticado"],
            ["/dashboard/pqrs", "Gestión de PQRS", "Autenticado"],
            ["/dashboard/pricing", "Planes y precios", "Autenticado"]
          ],
          [2500, 4000, 2860]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 7: Mapa de Navegación", size: 18, italics: true, font: "Times New Roman" })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 8. MANUAL TÉCNICO
        // ============================================
        createHeading("8. MANUAL TÉCNICO", 1),

        createHeading("8.1 Requisitos del Sistema", 2),
        createListItem("Node.js v18.0.0 o superior", "numbered-install"),
        createListItem("Bun v1.0.0 o superior (gestor de paquetes)", "numbered-install"),
        createListItem("PostgreSQL 14+ (para producción) o SQLite (desarrollo)", "numbered-install"),
        createListItem("Git para control de versiones", "numbered-install"),

        createHeading("8.2 Instalación", 2),
        createParagraph("Pasos para la instalación del proyecto:", { indent: true }),

        createParagraph("1. Clonar el repositorio:", { bold: true }),
        new Paragraph({
          spacing: { after: 100 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: "git clone [url-del-repositorio]", size: 20, font: "Courier New" })]
        }),

        createParagraph("2. Instalar dependencias:", { bold: true }),
        new Paragraph({
          spacing: { after: 100 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: "bun install", size: 20, font: "Courier New" })]
        }),

        createParagraph("3. Configurar variables de entorno (.env):", { bold: true }),
        new Paragraph({
          spacing: { after: 100 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: "DATABASE_URL=\"file:./dev.db\"\nJWT_SECRET=\"tu-clave-secreta-super-segura\"", size: 18, font: "Courier New" })]
        }),

        createParagraph("4. Ejecutar migraciones de base de datos:", { bold: true }),
        new Paragraph({
          spacing: { after: 100 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: "bun run db:push", size: 20, font: "Courier New" })]
        }),

        createParagraph("5. Iniciar el servidor de desarrollo:", { bold: true }),
        new Paragraph({
          spacing: { after: 100 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: "bun run dev", size: 20, font: "Courier New" })]
        }),

        createHeading("8.3 Estructura del Proyecto", 2),
        createParagraph("La estructura de carpetas del proyecto es la siguiente:", { indent: true }),

        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          children: [new TextRun({ text: `/my-project/
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
├── src/
│   ├── app/
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Páginas del dashboard
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── ui/             # Componentes Shadcn
│   │   ├── auth/           # Componentes de autenticación
│   │   └── layout/         # Componentes de layout
│   └── lib/
│       ├── auth.ts         # Utilidades de autenticación
│       ├── db.ts           # Cliente Prisma
│       ├── nlp-service.ts  # Clasificador NLP
│       └── store.ts        # Estado global (Zustand)
└── package.json`, size: 16, font: "Courier New" })]
        }),

        createHeading("8.4 APIs Principales", 2),
        
        createTable(
          ["Endpoint", "Método", "Descripción"],
          [
            ["/api/auth/register", "POST", "Registro de empresa y usuario admin"],
            ["/api/auth/login", "POST", "Autenticación de usuario"],
            ["/api/auth/me", "GET", "Datos del usuario actual"],
            ["/api/pqrs", "GET/POST", "Listar/Crear PQRS"],
            ["/api/pqrs/stats", "GET", "Estadísticas del dashboard"],
            ["/api/subscription", "GET/POST", "Ver/Actualizar suscripción"]
          ],
          [2800, 1400, 5160]
        ),
        
        new Paragraph({ spacing: { before: 200, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla 8: APIs del Sistema", size: 18, italics: true, font: "Times New Roman" })] }),

        // ============================================
        // 9. MANUAL DE USUARIO
        // ============================================
        createHeading("9. MANUAL DE USUARIO", 1),

        createHeading("9.1 Registro de Empresa", 2),
        createListItem("Acceda a la página principal y haga clic en \"Registrar Empresa\".", "numbered-manual"),
        createListItem("Complete los datos de la empresa: nombre, NIT, email, teléfono y ciudad.", "numbered-manual"),
        createListItem("Complete los datos del usuario administrador: nombre, apellido, email y contraseña.", "numbered-manual"),
        createListItem("Haga clic en \"Registrar Empresa (30 días gratis)\".", "numbered-manual"),
        createListItem("Será redirigido automáticamente al Dashboard.", "numbered-manual"),

        createHeading("9.2 Creación de PQRS", 2),
        createListItem("Desde el Dashboard, haga clic en \"Nueva PQRS\" (botón verde).", "numbered-manual"),
        createListItem("Seleccione el tipo de PQRS (Petición, Queja, Reclamo, Sugerencia, Denuncia o Felicitación).", "numbered-manual"),
        createListItem("Ingrese el título y la descripción detallada.", "numbered-manual"),
        createListItem("Complete los datos del ciudadano: nombre completo (obligatorio), email y teléfono.", "numbered-manual"),
        createListItem("Haga clic en \"Radicar PQRS\".", "numbered-manual"),
        createListItem("El sistema clasificará automáticamente la PQRS y mostrará los resultados de la IA.", "numbered-manual"),

        createHeading("9.3 Gestión de PQRS", 2),
        createListItem("Acceda a \"Ver Todas las PQRS\" desde el Dashboard.", "numbered-manual"),
        createListItem("Utilice los filtros para buscar por estado, tipo o texto.", "numbered-manual"),
        createListItem("Haga clic en cualquier PQRS para ver el detalle.", "numbered-manual"),
        createListItem("En el panel de detalle, puede cambiar el estado de la PQRS.", "numbered-manual"),
        createListItem("El historial de seguimiento muestra todos los cambios realizados.", "numbered-manual"),

        createHeading("9.4 Verificación de Suscripción", 2),
        createListItem("En el Dashboard, observe el banner amarillo que indica los días restantes de prueba.", "numbered-manual"),
        createListItem("Haga clic en \"Ver Planes\" para ver las opciones de suscripción.", "numbered-manual"),
        createListItem("Seleccione el plan deseado y haga clic en el botón correspondiente.", "numbered-manual"),
        createListItem("Una vez actualizado el plan, tendrá acceso completo al sistema.", "numbered-manual"),

        new Paragraph({ children: [new PageBreak()] }),

        // ============================================
        // 10. PLAN DE DESPLIEGUE
        // ============================================
        createHeading("10. PLAN DE DESPLIEGUE", 1),

        createHeading("10.1 Despliegue en Vercel (Frontend + API)", 2),
        createListItem("Crear cuenta en vercel.com", "numbered-install"),
        createListItem("Conectar el repositorio de GitHub/GitLab", "numbered-install"),
        createListItem("Configurar variables de entorno en Vercel", "numbered-install"),
        createListItem("Desplegar automáticamente con cada push a main", "numbered-install"),

        createHeading("10.2 Base de Datos en Supabase", 2),
        createListItem("Crear cuenta en supabase.com", "numbered-install"),
        createListItem("Crear nuevo proyecto PostgreSQL", "numbered-install"),
        createListItem("Copiar la cadena de conexión a DATABASE_URL", "numbered-install"),
        createListItem("Ejecutar migraciones con bun run db:push", "numbered-install"),

        createHeading("10.3 Consideraciones de Seguridad", 2),
        createListItem("Usar HTTPS en todas las comunicaciones.", "bullet-general"),
        createListItem("Configurar CORS para permitir solo el dominio de producción.", "bullet-general"),
        createListItem("Implementar rate limiting para prevenir abusos.", "bullet-general"),
        createListItem("Mantener actualizadas las dependencias del proyecto.", "bullet-general"),
        createListItem("Realizar backups periódicos de la base de datos.", "bullet-general"),

        // ============================================
        // 11. DISCURSO DE SUSTENTACIÓN
        // ============================================
        createHeading("11. DISCURSO DE SUSTENTACIÓN", 1),

        createParagraph("Estimados jurados, instructor líder y compañeros:", { indent: true }),
        
        createParagraph("El proyecto que presento hoy surge de una problemática real identificada en el Área Metropolitana de Cúcuta: la falta de herramientas tecnológicas accesibles para que las microempresas gestionen sus Peticiones, Quejas, Reclamos y Sugerencias de manera eficiente y cumpliendo con la normativa colombiana.", { indent: true }),
        
        createParagraph("Nuestra solución es un modelo de negocio SaaS que ofrece una plataforma web con inteligencia artificial para la clasificación automática de PQRS. El componente innovador es el clasificador NLP entrenado con la jerga local de Cúcuta, Villa del Rosario y Los Patios, lo que permite una precisión superior al 85% en la categorización de los requerimientos.", { indent: true }),
        
        createParagraph("Desde el punto de vista técnico, desarrollamos una arquitectura moderna utilizando Next.js 16, Prisma ORM y una base de datos PostgreSQL. Implementamos un sistema de autenticación seguro con JWT y un modelo de suscripción con período de prueba de 30 días.", { indent: true }),
        
        createParagraph("La viabilidad comercial está respaldada por una estrategia de precios diseñada para el poder adquisitivo de las microempresas colombianas: un plan básico a $49,900 COP mensuales, equivalente al 3.8% de un salario mínimo, significativamente más accesible que las alternativas del mercado.", { indent: true }),
        
        createParagraph("En conclusión, este proyecto demuestra cómo la tecnología puede resolver problemas reales de las microempresas colombianas, generando valor económico y social para la región. El modelo de negocio es sostenible y escalable, con un mercado potencial de más de 45,000 microempresas solo en el Área Metropolitana de Cúcuta.", { indent: true }),
        
        createParagraph("Muchas gracias por su atención.", { indent: true, bold: true }),

        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "— Fin del Documento —", size: 22, italics: true, color: colors.secondary, font: "Times New Roman" })]
        })
      ]
    }
  ]
});

// Guardar el documento
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/Documento_SENA_PQRS_SaaS.docx", buffer);
  console.log("✅ Documento SENA generado exitosamente: Documento_SENA_PQRS_SaaS.docx");
});
