import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent, ReactNode } from 'react';
import { contactForm, profile } from '../data/portfolio';
import { contactButtonClass } from './ContactButton';
import { OpenContactFormContext } from './contactFormContext';

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <OpenContactFormContext.Provider value={() => setOpen(true)}>
      {children}
      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </OpenContactFormContext.Provider>
  );
}

type Field = 'name' | 'email' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const emptyValues: Values = { name: '', email: '', message: '' };
const MIN_MESSAGE = 10;

function validate(values: Values, emailInput: HTMLInputElement | null): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim() || (emailInput && !emailInput.validity.valid)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (values.message.trim().length < MIN_MESSAGE) {
    errors.message = `Please write a message of at least ${MIN_MESSAGE} characters.`;
  }
  return errors;
}

async function sendMessage(values: Values, honey: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(contactForm.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        // FormSubmit uses a field named "email" as the Reply-To address.
        email: values.email.trim(),
        message: values.message.trim(),
        _subject: `${contactForm.subject}: ${values.name.trim()}`,
        _template: 'table',
        _honey: honey,
      }),
      signal: controller.signal,
    });
    const data: { success?: string | boolean; message?: string } | null = await response.json().catch(() => null);
    if (!response.ok || String(data?.success) !== 'true') {
      throw new Error(data?.message ?? `Request failed with status ${response.status}`);
    }
  } finally {
    window.clearTimeout(timeout);
  }
}

const labelClass = 'text-[11px] font-light uppercase tracking-widest text-mist/70 sm:text-xs';
const inputClass =
  'w-full rounded-2xl border bg-white/[0.03] px-5 py-3.5 text-base font-light text-mist placeholder:text-mist/35 transition-colors duration-200 focus-visible:outline-offset-2';
const inputBorder = (invalid: boolean) =>
  invalid ? 'border-rose-400/80 focus:border-rose-300' : 'border-mist/25 hover:border-mist/45 focus:border-mist';

function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const id = useId();
  const titleId = `${id}-title`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      // Lock page scroll, padding for the scrollbar so the page doesn't shift sideways.
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
    if (status === 'sent') {
      setValues(emptyValues);
      setErrors({});
      setSubmitted(false);
      setStatus('idle');
    }
    onClose();
  };

  // A click on the dialog element itself (not its content) is a click on the backdrop.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next, emailRef.current));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    setSubmitted(true);
    const found = validate(values, emailRef.current);
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.email) return emailRef.current?.focus();
    if (found.message) return messageRef.current?.focus();

    const honey = honeyRef.current?.value ?? '';
    setStatus('sending');
    try {
      // Bots fill the hidden field; pretend it worked and send nothing.
      if (!honey) await sendMessage(values, honey);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (field: Field, hint?: string) =>
    [hint, errors[field] ? `${id}-${field}-error` : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="contact-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-[32px] border-2 border-mist bg-ink p-0 text-mist backdrop:bg-ink/80 backdrop:backdrop-blur-sm sm:rounded-[40px]"
    >
      <div className="relative p-6 sm:p-10">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-mist/25 text-mist transition-colors duration-200 hover:border-mist hover:bg-mist/10 focus-visible:outline-offset-2 sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>

        {status === 'sent' ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center" role="status">
            <CheckCircle2 className="h-14 w-14 text-emerald-400" aria-hidden="true" />
            <h2 id={titleId} className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
              Message sent
            </h2>
            <p className="max-w-sm font-light leading-relaxed text-mist/75">
              Thanks, {values.name.trim().split(/\s+/)[0]}! I’ll get back to you at{' '}
              <span className="text-mist">{values.email.trim()}</span> soon.
            </p>
            <button type="button" onClick={() => dialogRef.current?.close()} className={`${contactButtonClass} mt-2`}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              id={titleId}
              className="hero-heading pr-12 font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.25rem, 7vw, 3.5rem)' }}
            >
              Let’s talk
            </h2>
            <p className="mt-3 max-w-md font-light leading-relaxed text-mist/70">
              Send me a message and it lands straight in my inbox.
            </p>

            <form noValidate onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-name`} className={labelClass}>
                  Name
                </label>
                <input
                  ref={nameRef}
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={values.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy('name')}
                  className={`${inputClass} ${inputBorder(Boolean(errors.name))}`}
                />
                {errors.name && <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-email`} className={labelClass}>
                  Email
                </label>
                <input
                  ref={emailRef}
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={200}
                  required
                  value={values.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy('email', `${id}-email-hint`)}
                  className={`${inputClass} ${inputBorder(Boolean(errors.email))}`}
                />
                <p id={`${id}-email-hint`} className="text-xs font-light text-mist/50">
                  So I can reply to you.
                </p>
                {errors.email && <FieldError id={`${id}-email-error`}>{errors.email}</FieldError>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-message`} className={labelClass}>
                  Message
                </label>
                <textarea
                  ref={messageRef}
                  id={`${id}-message`}
                  name="message"
                  rows={5}
                  maxLength={5000}
                  required
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Hi Sajan, I’d like to talk about…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={describedBy('message')}
                  className={`${inputClass} min-h-[8rem] resize-y ${inputBorder(Boolean(errors.message))}`}
                />
                {errors.message && <FieldError id={`${id}-message-error`}>{errors.message}</FieldError>}
              </div>

              {/* Honeypot: hidden from people, filled in by bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${id}-honey`}>Leave this field empty</label>
                <input ref={honeyRef} id={`${id}-honey`} name="_honey" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div aria-live="polite">
                {status === 'error' && (
                  <p className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-5 py-4 text-sm font-light leading-relaxed text-mist">
                    Your message couldn’t be sent. Please try again, or email me at{' '}
                    <a href={`mailto:${profile.email}`} className="font-normal underline underline-offset-4">
                      {profile.email}
                    </a>
                    .
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`${contactButtonClass} mt-1 gap-2.5 self-start disabled:cursor-wait disabled:opacity-80`}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm font-light text-rose-300">
      {children}
    </p>
  );
}
