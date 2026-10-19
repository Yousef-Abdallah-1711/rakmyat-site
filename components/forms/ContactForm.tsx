"use client";

import { FormEvent, ReactNode, useState } from "react";
import { localeCopy, type Locale } from "@/content/i18n";

type ContactFormProps = {
  children: ReactNode;
  className?: string;
  locale?: Locale;
};

export function ContactForm({ children, className, locale = "en" }: ContactFormProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(localeCopy[locale].formDisabled);
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
      <p className="form-status" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
