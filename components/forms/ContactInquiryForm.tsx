"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/content/i18n";
import { getInquiryCopy } from "@/content/inquiry-copy";

type Values = { fullName: string; phone: string; email: string; company: string; serviceType: string; budget: string; timeline: string; description: string; referenceUrl: string };
const emptyValues: Values = { fullName: "", phone: "", email: "", company: "", serviceType: "", budget: "", timeline: "", description: "", referenceUrl: "" };

export function ContactInquiryForm({ locale }: { locale: Locale }) {
  const copy = getInquiryCopy(locale); const id = useId(); const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef<string | null>(null);
  const [values, setValues] = useState<Values>(emptyValues); const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitted, setSubmitted] = useState(false);
  const labels = Object.fromEntries(["fullName", "phone", "email", "company", "service", "budget", "timeline", "description", "reference"].map((key) => [key, copy[key as keyof typeof copy]])) as Record<string,string>;

  function validate(field: keyof Values, value: string) {
    if (field === "fullName" && value.trim().length < 2) return locale === "en" ? "Enter your name." : "أدخل اسمك.";
    if (field === "phone" && !/^[+\d().\s-]{7,32}$/.test(value.trim())) return locale === "en" ? "Enter a valid phone number." : "أدخل رقم هاتف صحيحًا.";
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return locale === "en" ? "Enter a valid email address." : "أدخل بريدًا إلكترونيًا صحيحًا.";
    if (field === "referenceUrl" && value) { try { const url = new URL(value); if (!/^https?:$/.test(url.protocol)) throw new Error(); } catch { return locale === "en" ? "Enter a valid http or https URL." : "أدخل رابطًا صحيحًا يبدأ بـ http أو https."; } }
    return "";
  }

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (submitted || errors[field]) setErrors((current) => ({ ...current, [field]: validate(field, value) }));
  }

  function field(field: keyof Values, type: string, required = false, wide = false) {
    const errorId = `${id}-${field}-error`; const props = { id: `${id}-${field}`, name: field, value: values[field], required, dir: field === "phone" || field === "email" || field === "referenceUrl" ? "ltr" as const : undefined, "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? errorId : undefined, maxLength: field === "referenceUrl" ? 2048 : field === "description" ? 5000 : field === "phone" ? 32 : field === "email" ? 254 : 160, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field, event.target.value), onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setErrors((current) => ({ ...current, [field]: validate(field, event.target.value) })) };
    const label = labels[field === "referenceUrl" ? "reference" : field];
    return <div className={`col-md-${wide ? "12" : "6"} mb-20`} key={field}><label className="inquiry-label" htmlFor={`${id}-${field}`}>{label}{required ? <span aria-hidden="true"> *</span> : <span className="inquiry-optional"> · {copy.optional}</span>}</label>{field === "description" ? <textarea {...props} className="form-control" rows={4} /> : <input {...props} className="form-control" type={type} autoComplete={field === "fullName" ? "name" : field === "phone" ? "tel" : field === "email" ? "email" : field === "company" ? "organization" : undefined} />}{errors[field] && <span className="inquiry-field-error" id={errorId} aria-live="polite">{errors[field]}</span>}</div>;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true);
    const nextErrors = Object.fromEntries((Object.keys(values) as (keyof Values)[]).map((key) => [key, validate(key, values[key])]).filter(([, message]) => message));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { const key = Object.keys(nextErrors)[0]; formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(); setStatus("error"); return; }
    setStatus("sending");
    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, serviceType: values.serviceType || null, budget: values.budget || null, timeline: values.timeline || null, idempotencyKey: idempotencyKey.current, website: "" }) });
      if (!response.ok) throw new Error("not_saved");
      idempotencyKey.current = null; setStatus("success"); setValues(emptyValues); setErrors({}); setSubmitted(false);
    } catch { setStatus("error"); }
  }

  return <form ref={formRef} className="form inquiry-form" onSubmit={submit} noValidate>
    <div className="row">
      {field("fullName", "text", true)}{field("phone", "tel", true)}{field("email", "email")}{field("company", "text")}
      {(["serviceType", "budget", "timeline"] as const).map((key) => {
        const optionKey = key === "serviceType" ? "service" : key;
        const options = key === "serviceType" ? getInquiryCopy(locale).serviceLabels : key === "budget" ? getInquiryCopy(locale).budgetLabels : getInquiryCopy(locale).timelineLabels;
        const keys = key === "serviceType" ? ["website", "mobile-app", "business-system", "ai-automation", "integration", "other"] : key === "budget" ? ["not-set", "estimate", "range-ready", "prefer-not-to-say"] : ["exploring", "one-to-three-months", "three-to-six-months", "flexible"];
        return <div className="col-md-6 mb-20" key={key}><label className="inquiry-label" htmlFor={`${id}-${key}`}>{labels[optionKey]} <span className="inquiry-optional">· {copy.optional}</span></label><select className="form-select" id={`${id}-${key}`} name={key} value={values[key]} onChange={(event) => update(key, event.target.value)}><option value="">{copy.select}</option>{keys.map((value, index) => <option key={value} value={value}>{options[index]}</option>)}</select></div>;
      })}
      {field("description", "text", false, true)}{field("referenceUrl", "url", false, true)}
      <div className="inquiry-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>{copy.honeypot}</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="col-12"><p className="inquiry-privacy">{copy.privacy}</p></div>
      <div className="col-12 text-center"><button className="btn rounded-pill blue5-3Dbutn hover-blue2 sm-butn fw-bold text-light" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>{status === "sending" ? copy.sending : copy.submit}</button><p className={`inquiry-status inquiry-status--${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">{status === "success" ? copy.success : status === "error" ? (Object.keys(errors).length ? copy.invalid : copy.unavailable) : ""}</p></div>
    </div>
  </form>;
}
