/**
 * ============================================
 * SERVICIO NLP PARA CLASIFICACIÓN DE PQRS
 * Clasificador IA con jerga local de Cúcuta
 * ============================================
 */

// Palabras clave para clasificación de tipos de PQRS (jerga local)
const KEYWORDS = {
  PETICION: [
    'solicito', 'solicitud', 'requiero', 'necesito', 'pido', 'quiero',
    'información', 'informacion', 'certificado', 'constancia', 'documento',
    'trámite', 'tramite', 'autorización', 'autorizacion', 'permiso',
    'necesito que me colaboren', 'me pueden ayudar', 'quisiera saber'
  ],
  QUEJA: [
    'queja', 'quejarse', 'inconforme', 'disconforme', 'descontento',
    'mal servicio', 'mala atención', 'mala atencion', 'pésimo', 'pesimo',
    'no me gustó', 'no me gusto', 'me siento mal', 'molesto', 'indignado',
    'qué pena', 'que pena', 'vergüenza', 'verguenza', 'desorden',
    'no es justo', 'injusticia', 'maltrato', 'grosero', 'grosería'
  ],
  RECLAMO: [
    'reclamo', 'reclamación', 'reclamacion', 'reintegro', 'devolución',
    'devolucion', 'solución', 'solucion', 'resarcimiento', 'indemnización',
    'indemnizacion', 'compensación', 'compensacion', 'no funciona',
    'dañado', 'danado', 'defectuoso', 'no sirve', 'estafado', 'engañado',
    'enganado', 'dinero', 'reembolso', 'me cobraron mal', 'cobro excesivo'
  ],
  SUGERENCIA: [
    'sugerencia', 'sugerir', 'propuesta', 'propongo', 'recomiendo',
    'sería bueno', 'seria bueno', 'mejorar', 'mejora', 'optimizar',
    'idea', 'podrían', 'podrian', 'tal vez', 'quizás', 'quizas',
    'les recomiendo', 'mi aporte', 'contribución', 'contribucion'
  ],
  DENUNCIA: [
    'denuncia', 'denunciar', 'irregularidad', 'corrupción', 'corrupcion',
    'fraude', 'estafa', 'robo', 'hurto', 'delito', 'ilegal', 'ilícito',
    'ilicito', 'infracción', 'infraccion', 'violación', 'violacion',
    'abuso', 'negligencia', 'improbidad', 'funcionario', 'empleado público',
    'empleado publico', 'soborno', 'coima', 'mordida'
  ],
  FELICITACION: [
    'felicitación', 'felicitacion', 'felicito', 'felicitaciones',
    'agradecimiento', 'agradezco', 'gracias', 'excelente', 'genial',
    'muy bueno', 'muy bien', 'maravilloso', 'increíble', 'increible',
    'súper', 'super', 'bendecido', 'orgullo', 'ejemplar', 'ejemplo',
    'muy amable', 'atento', 'colaborador', 'eficiente'
  ]
};

// Patrones de sentimiento (jerga local norte de Santander)
const SENTIMENT_PATTERNS = {
  POSITIVO: [
    'excelente', 'genial', 'maravilloso', 'increíble', 'increible',
    'súper', 'super', 'muy bueno', 'perfecto', 'fantástico', 'fantastico',
    'agradecido', 'bendecido', 'feliz', 'contento', 'satisfecho',
    'Gracias', 'gracias', 'Dios lo bendiga', 'muy amable', 'atento'
  ],
  NEGATIVO: [
    'terrible', 'horrible', 'pésimo', 'pesimo', 'malo', 'muy malo',
    'desastroso', 'inaceptable', 'inútil', 'inutil', 'pérdida', 'perdida',
    'nunca más', 'nunca mas', 'decepcionado', 'frustrado', 'enfadado',
    'indignado', 'furioso', 'molesto', 'hartó', 'harto', 'cansado',
    'no sirve', 'una porquería', 'una porqueria', 'basura', 'estafa'
  ],
  MUY_NEGATIVO: [
    'demando', 'demanda', 'denuncia penal', 'fiscalía', 'fiscalia',
    'procuraduría', 'procuraduria', 'defensoría', 'defensoria',
    'personería', 'personeria', 'contraloría', 'contraloria',
    'violación', 'violacion', 'delito', 'crimen', 'criminal',
    'ladrón', 'ladron', 'estafador', 'corrupto', 'delincuente'
  ]
};

// Categorías comunes para microempresas
const CATEGORIES = [
  { id: 'facturacion', keywords: ['factura', 'cobro', 'pago', 'precio', 'tarifa', 'valor', 'dinero', 'recibo'] },
  { id: 'producto', keywords: ['producto', 'artículo', 'articulo', 'mercancía', 'mercancia', 'compra', 'adquirí', 'adquiri'] },
  { id: 'servicio', keywords: ['servicio', 'atención', 'atencion', 'asesoría', 'asesoria', 'soporte', 'ayuda'] },
  { id: 'entrega', keywords: ['entrega', 'envío', 'envio', 'domicilio', 'demora', 'retraso', 'tiempo', 'fecha'] },
  { id: 'calidad', keywords: ['calidad', 'defecto', 'dañado', 'danado', 'malo', 'falla', 'avería', 'averia'] },
  { id: 'personal', keywords: ['empleado', 'vendedor', 'asesor', 'personal', 'señorita', 'señor', 'señora', 'atención', 'maltrato'] },
  { id: 'instalaciones', keywords: ['sucursal', 'local', 'tienda', 'oficina', 'instalaciones', 'sede', 'lugar'] },
  { id: 'documentos', keywords: ['documento', 'certificado', 'constancia', 'garantía', 'garantia', 'contrato', 'póliza', 'poliza'] }
];

export interface ClassificationResult {
  tipo: string;
  categoria: string;
  sentimiento: string;
  confianza: number;
  prioridadSugerida: string;
}

/**
 * Clasificar un texto de PQRS
 */
export function classifyPqrs(texto: string): ClassificationResult {
  const textoLower = texto.toLowerCase();
  
  // 1. Detectar tipo de PQRS
  const tipoScores: Record<string, number> = {};
  for (const [tipo, keywords] of Object.entries(KEYWORDS)) {
    tipoScores[tipo] = keywords.reduce((score, keyword) => {
      return score + (textoLower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  }
  
  const tipoGanador = Object.entries(tipoScores)
    .sort(([,a], [,b]) => b - a)[0];
  
  const tipo = tipoGanador[1] > 0 ? tipoGanador[0] : 'PETICION';
  
  // 2. Detectar categoría
  const categoriaScores: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoriaScores[cat.id] = cat.keywords.reduce((score, keyword) => {
      return score + (textoLower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  }
  
  const categoriaGanador = Object.entries(categoriaScores)
    .sort(([,a], [,b]) => b - a)[0];
  
  const categoria = categoriaGanador[1] > 0 ? categoriaGanador[0] : 'general';
  
  // 3. Detectar sentimiento
  const positivo = SENTIMENT_PATTERNS.POSITIVO.filter(k => textoLower.includes(k.toLowerCase())).length;
  const negativo = SENTIMENT_PATTERNS.NEGATIVO.filter(k => textoLower.includes(k.toLowerCase())).length;
  const muyNegativo = SENTIMENT_PATTERNS.MUY_NEGATIVO.filter(k => textoLower.includes(k.toLowerCase())).length;
  
  let sentimiento = 'NEUTRO';
  if (muyNegativo > 0) {
    sentimiento = 'MUY_NEGATIVO';
  } else if (negativo > positivo && negativo > 0) {
    sentimiento = 'NEGATIVO';
  } else if (positivo > negativo && positivo > 0) {
    sentimiento = 'POSITIVO';
  }
  
  // 4. Calcular confianza (0-1)
  const totalMatches = Object.values(tipoScores).reduce((a, b) => a + b, 0);
  const confianza = Math.min(0.95, (tipoGanador[1] / Math.max(totalMatches, 1)) * 0.8 + 0.15);
  
  // 5. Sugerir prioridad basada en sentimiento y tipo
  let prioridadSugerida = 'MEDIA';
  if (sentimiento === 'MUY_NEGATIVO' || tipo === 'DENUNCIA') {
    prioridadSugerida = 'URGENCIA';
  } else if (sentimiento === 'NEGATIVO' || tipo === 'RECLAMO') {
    prioridadSugerida = 'ALTA';
  } else if (sentimiento === 'POSITIVO' || tipo === 'FELICITACION') {
    prioridadSugerida = 'BAJA';
  }
  
  return {
    tipo,
    categoria,
    sentimiento,
    confianza: Math.round(confianza * 100) / 100,
    prioridadSugerida
  };
}

/**
 * Extraer entidades del texto (NIT, teléfono, email)
 */
export function extractEntities(texto: string): {
  nits: string[];
  telefonos: string[];
  emails: string[];
} {
  const nitRegex = /\b\d{9,12}[-\s]?\d?\b/g;
  const telefonoRegex = /\b(?:\+57\s?)?(?:3\d{2}|7\d{2})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/g;
  const emailRegex = /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g;
  
  return {
    nits: texto.match(nitRegex) || [],
    telefonos: texto.match(telefonoRegex) || [],
    emails: texto.match(emailRegex) || []
  };
}

/**
 * Sugerir respuesta automática basada en clasificación
 */
export function suggestResponse(clasificacion: ClassificationResult): string {
  const respuestas: Record<string, string> = {
    PETICION: 'Hemos recibido su solicitud y será atendida en el menor tiempo posible. Nuestro equipo revisará su requerimiento y le dará respuesta dentro del plazo establecido por ley.',
    QUEJA: 'Lamentamos los inconvenientes presentados. Su queja ha sido registrada y será investigada. Nos comprometemos a tomar las medidas correctivas necesarias.',
    RECLAMO: 'Hemos recibido su reclamo y procederemos a verificar la situación. En caso de ser procedente, se realizará la respectiva corrección o compensación.',
    SUGERENCIA: 'Agradecemos su sugerencia. Las opiniones de nuestros usuarios son valiosas para mejorar nuestros servicios. Su propuesta será evaluada por nuestro equipo.',
    DENUNCIA: 'Su denuncia ha sido recibida con confidencialidad. Será remitida a las instancias correspondientes para su investigación según los protocolos establecidos.',
    FELICITACION: '¡Gracias por sus amables palabras! Nos alegra saber que tuvo una experiencia positiva. Compartiremos su reconocimiento con todo el equipo.'
  };
  
  return respuestas[clasificacion.tipo] || respuestas.PETICION;
}
