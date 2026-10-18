"use client";

import { FormEvent, ReactNode, useState } from "react";

type ContactFormProps = {
  children: ReactNode;
  className?: string;
};

export function ContactForm({ children, className }: ContactFormProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "This form is a static demo and is not connected to a submission service.",
    );
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
