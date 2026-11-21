export type FormValues = Record<string, string>;

/**
 * Punto único de integración de los formularios conversacionales.
 *
 * PENDIENTE: hoy no envía nada (igual que el prototipo de referencia).
 * Conectar acá, según `formId`:
 *  - "audit":  newsletter + mini auditoría (Substack / servicio de email)
 *  - "budget": pedido de presupuesto (email o herramienta a definir)
 */
export async function submitForm(formId: string, values: FormValues): Promise<void> {
  void formId;
  void values;
}
