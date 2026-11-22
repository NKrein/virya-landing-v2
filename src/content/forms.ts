export type FormStep = {
  id: string;
  question: string;
  type: "text" | "email";
  autoComplete: string;
  placeholder: string;
  button: string;
};

export type FormDef = {
  steps: readonly FormStep[];
  /** `{name}` se reemplaza por el valor del paso con id "nombre". */
  done: string;
};

/** Textos compartidos por todos los formularios conversacionales. */
export const formCommon = {
  errors: {
    required: "Escribí una respuesta para seguir.",
    email: "Revisá el email: parece que le falta algo.",
  },
  back: "Volver al paso anterior",
} as const;

/** Newsletter + mini auditoría (sección N.º 01). PENDIENTE: conectar Substack / servicio de email. */
export const auditForm: FormDef = {
  steps: [
    {
      id: "email",
      question: "Dejanos tu email ↓",
      type: "email",
      autoComplete: "email",
      placeholder: "tu@email.com",
      button: "Seguir",
    },
    {
      id: "nombre",
      question: "¿Y cómo te llamás?",
      type: "text",
      autoComplete: "given-name",
      placeholder: "Tu nombre",
      button: "Suscribirme",
    },
  ],
  done: "Listo, {name}. Revisá tu email: la auditoría ya va en camino, y el newsletter te llega una vez por mes.",
};

/** Pedido de presupuesto (sección N.º 04). PENDIENTE: definir destino (email o herramienta). */
export const budgetForm: FormDef = {
  steps: [
    {
      id: "vende",
      question: "Primero, contanos qué vendés",
      type: "text",
      autoComplete: "off",
      placeholder: "Ej: cursos online de cerámica",
      button: "Seguir",
    },
    {
      id: "mejorar",
      question: "¿Qué te gustaría mejorar de tu marketing?",
      type: "text",
      autoComplete: "off",
      placeholder: "Ej: me siguen pero no me compran",
      button: "Seguir",
    },
    {
      id: "email",
      question: "¿A qué email te mandamos la propuesta?",
      type: "email",
      autoComplete: "email",
      placeholder: "tu@email.com",
      button: "Seguir",
    },
    {
      id: "nombre",
      question: "Por último, ¿cómo te llamás?",
      type: "text",
      autoComplete: "name",
      placeholder: "Tu nombre",
      button: "Pedir presupuesto",
    },
  ],
  done: "Gracias, {name}. Leemos lo que nos contaste y te respondemos con una propuesta a medida.",
};
