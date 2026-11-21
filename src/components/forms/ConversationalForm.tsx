"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { formCommon, type FormDef } from "@/content";
import { fmt } from "@/lib/format";
import { submitForm } from "@/lib/submit-form";

type Props = {
  /** Identificador del formulario (ver lib/submit-form.ts) */
  formId: string;
  def: FormDef;
  ariaLabel: string;
  /** `ink`: sobre fondo tinta (footer). */
  tone?: "light" | "ink";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario conversacional: una pregunta por vez, con volver, validación
 * simple de email y confirmación personalizada con el nombre.
 * Las preguntas y mensajes salen de src/content/forms.ts.
 */
export function ConversationalForm({ formId, def, ariaLabel, tone = "light" }: Props) {
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  const ink = tone === "ink";
  const total = def.steps.length;
  const done = step >= total;
  const st = def.steps[Math.min(step, total - 1)];
  const inputId = `${formId}-input`;
  const errorId = `${formId}-error`;

  function next() {
    const value = current.trim();
    if (!value) return setError(formCommon.errors.required);
    if (st.type === "email" && !EMAIL_RE.test(value)) return setError(formCommon.errors.email);

    const nextVals = { ...vals, [st.id]: value };
    const nextStep = step + 1;
    setVals(nextVals);
    setStep(nextStep);
    setCurrent(def.steps[nextStep] ? (nextVals[def.steps[nextStep].id] ?? "") : "");
    setError("");
    if (nextStep >= total) void submitForm(formId, nextVals);
  }

  function back() {
    if (step < 1) return;
    const prev = step - 1;
    setStep(prev);
    setCurrent(vals[def.steps[prev].id] ?? "");
    setError("");
  }

  return (
    <form
      aria-label={ariaLabel}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="flex flex-col gap-2.5"
    >
      {!done && (
        // key = step: remonta el bloque y reinicia la animación de entrada
        <div key={step} className="v-step flex flex-col gap-2.5">
          <label htmlFor={inputId} className="text-base leading-[1.35] font-bold">
            {st.question}
          </label>
          <div className="v-inrow">
            <input
              id={inputId}
              className={`v-in ${ink ? "border-blanco" : ""}`}
              type={st.type}
              autoComplete={st.autoComplete}
              placeholder={st.placeholder}
              value={current}
              autoFocus={step > 0}
              onChange={(e) => {
                setCurrent(e.target.value);
                setError("");
              }}
              aria-describedby={errorId}
              aria-invalid={error ? true : undefined}
            />
            <button type="submit" className="v-go v-btn bg-terracota text-blanco">
              {st.button}
            </button>
          </div>
          <p
            id={errorId}
            aria-live="polite"
            className={`m-0 min-h-5 text-[15px] font-medium ${ink ? "text-blanco" : "text-terracota"}`}
          >
            {error}
          </p>
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className={`min-h-11 cursor-pointer self-start border-0 bg-transparent p-0 text-[15px] underline ${ink ? "text-blanco" : "text-tinta"}`}
              style={{ font: "inherit", fontSize: 15 }}
            >
              {formCommon.back}
            </button>
          )}
        </div>
      )}

      {done && (
        <div
          role="status"
          className="v-step flex items-start gap-3.5 rounded-md border border-tinta bg-blanco p-[18px] text-tinta"
        >
          <CheckIcon />
          <p className="m-0 text-[17px] leading-normal">
            {fmt(def.done, { name: vals.nombre ?? "" })}
          </p>
        </div>
      )}
    </form>
  );
}
