"use client";

import { useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import type { Locale } from "@/content/i18n";
import { getInquiryCopy } from "@/content/inquiry-copy";
import { companyValueSchema, descriptionValueSchema, emailValueSchema, fullNameSchema, parseInquiryPhone, referenceUrlValueSchema } from "@/lib/inquiry-schema";

type Values = { fullName: string; phone: string; email: string; company: string; serviceType: string; budget: string; timeline: string; description: string; referenceUrl: string };
type TextField = "fullName" | "phone" | "email" | "company" | "description" | "referenceUrl";
const textFields: TextField[] = ["fullName", "phone", "email", "company", "description", "referenceUrl"];
const emptyValues: Values = { fullName: "", phone: "", email: "", company: "", serviceType: "", budget: "", timeline: "", description: "", referenceUrl: "" };

export function ContactInquiryForm({ locale }: { locale: Locale }) {
  const copy = getInquiryCopy(locale); const id = useId(); const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef<string | null>(null);
  const [values, setValues] = useState<Values>(emptyValues); const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<TextField, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "invalid" | "rateLimited">("idle");
  const [submitted, setSubmitted] = useState(false);
  const labels: Record<string, string> = { fullName: copy.fullName, phone: copy.phone, email: copy.email, company: copy.company, serviceType: copy.service, budget: copy.budget, timeline: copy.timeline, description: copy.description, referenceUrl: copy.reference };

  function validate(field: TextField, value: string) {
    const valid = field === "fullName" ? fullNameSchema.safeParse(value).success
      : field === "phone" ? parseInquiryPhone(value) !== null
      : field === "email" ? !value.trim() || emailValueSchema.safeParse(value).success
      : field === "company" ? !value.trim() || companyValueSchema.safeParse(value).success
      : field === "description" ? !value.trim() || descriptionValueSchema.safeParse(value).success
      : !value.trim() || referenceUrlValueSchema.safeParse(value).success;
    if (valid) return "";
    return field === "fullName" ? copy.fullNameError : field === "phone" ? copy.phoneError : field === "email" ? copy.emailError : field === "company" ? copy.companyError : field === "description" ? copy.descriptionError : copy.referenceError;
  }

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (textFields.includes(field as TextField) && (submitted || touched[field as TextField])) {
      const textField = field as TextField;
      setErrors((current) => ({ ...current, [textField]: validate(textField, value) }));
    }
    if (status !== "idle" && status !== "sending") setStatus("idle");
  }

  function field(fieldName: TextField, type: string, required = false, wide = false) {
    const error = errors[fieldName]; const errorId = `${id}-${fieldName}-error`; const inputId = `${id}-${fieldName}`;
    const maxLength = fieldName === "referenceUrl" ? 2048 : fieldName === "description" ? 5000 : fieldName === "phone" ? 32 : fieldName === "email" ? 254 : fieldName === "company" ? 160 : 120;
    const props = {
      id: inputId, name: fieldName, value: values[fieldName], required,
      dir: fieldName === "phone" || fieldName === "email" || fieldName === "referenceUrl" ? "ltr" as const : undefined,
      "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined, maxLength,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(fieldName, event.target.value),
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTouched((current) => ({ ...current, [fieldName]: true }));
        setErrors((current) => ({ ...current, [fieldName]: validate(fieldName, event.target.value) }));
      },
    };
    const label = labels[fieldName];
    return <div className={`col-md-${wide ? "12" : "6"} mb-20`} key={fieldName}>
      <label className="inquiry-label" htmlFor={inputId}>{label}{required ? <span aria-hidden="true"> *</span> : <span className="inquiry-optional"> · {copy.optional}</span>}</label>
      {fieldName === "description" ? <textarea {...props} className="form-control" rows={4} /> : <input {...props} className="form-control" type={type} inputMode={fieldName === "phone" ? "tel" : undefined} autoComplete={fieldName === "fullName" ? "name" : fieldName === "phone" ? "tel" : fieldName === "email" ? "email" : fieldName === "company" ? "organization" : undefined} />}
      {error && <span className="inquiry-field-error" id={errorId} aria-live="polite">{error}</span>}
    </div>;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    const nextErrors: Partial<Record<TextField, string>> = {};
    for (const key of textFields) { const message = validate(key, values[key]); if (message) nextErrors[key] = message; }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = textFields.find((key) => nextErrors[key]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setStatus("error"); return;
    }
    setStatus("sending");
    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json", "X-Rakmyat-Locale": locale }, body: JSON.stringify({ ...values, serviceType: values.serviceType || null, budget: values.budget || null, timeline: values.timeline || null, idempotencyKey: idempotencyKey.current, website: "" }) });
      if (response.status === 429) { setStatus("rateLimited"); return; }
      if (response.status === 422) { setStatus("invalid"); return; }
      if (!response.ok) throw new Error("not_saved");
      idempotencyKey.current = null; setStatus("success"); setValues(emptyValues); setErrors({}); setTouched({}); setSubmitted(false);
    } catch { setStatus("error"); }
  }

  return <form ref={formRef} className="form inquiry-form" onSubmit={submit} noValidate>
    <div className="row">
      {status === "error" && Object.keys(errors).length > 0 && <div className="col-12" role="alert" aria-live="assertive"><p className="inquiry-status inquiry-status--error">{copy.invalid}</p><ul>{textFields.filter((key) => errors[key]).map((key) => <li key={key}><a href={`#${id}-${key}`} onClick={(event) => { event.preventDefault(); formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(); }}>{labels[key]}: {errors[key]}</a></li>)}</ul></div>}
      {field("fullName", "text", true)}{field("phone", "tel", true)}{field("email", "email")}{field("company", "text")}
      {(["serviceType", "budget", "timeline"] as const).map((key) => {
        const options = key === "serviceType" ? copy.serviceLabels : key === "budget" ? copy.budgetLabels : copy.timelineLabels;
        const keys = key === "serviceType" ? ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"] : key === "budget" ? ["not-set", "estimate", "range-ready", "prefer-not-to-say"] : ["exploring", "one-to-three-months", "three-to-six-months", "flexible"];
        return <div className="col-md-6 mb-20" key={key}><label className="inquiry-label" htmlFor={`${id}-${key}`}>{labels[key]} <span className="inquiry-optional">· {copy.optional}</span></label><select className="form-select" id={`${id}-${key}`} name={key} value={values[key]} onChange={(event) => update(key, event.target.value)}><option value="">{copy.select}</option>{keys.map((value, index) => <option key={value} value={value}>{options[index]}</option>)}</select></div>;
      })}
      {field("description", "text", false, true)}{field("referenceUrl", "url", false, true)}
      <div className="inquiry-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>{copy.honeypot}</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="col-12"><p className="inquiry-privacy">{copy.privacy}</p></div>
      <div className="col-12 text-center"><button className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>{status === "sending" ? copy.sending : copy.submit}</button><p className={`inquiry-status inquiry-status--${status}`} role={status === "error" || status === "invalid" || status === "rateLimited" ? "alert" : "status"} aria-live="polite">{status === "success" ? copy.success : status === "rateLimited" ? copy.rateLimited : status === "invalid" ? copy.invalid : status === "error" && Object.keys(errors).length === 0 ? copy.unavailable : ""}</p></div>
    </div>
  </form>;
}
