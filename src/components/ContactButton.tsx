import { useOpenContactForm } from './contactFormContext';

interface ContactButtonProps {
  /** Link target. Leave it out to open the contact form instead. */
  href?: string;
  label?: string;
  className?: string;
}

export const contactButtonClass =
  'btn-contact inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base';

export default function ContactButton({ href, label = 'Contact Me', className = '' }: ContactButtonProps) {
  const openContactForm = useOpenContactForm();
  const classes = `${contactButtonClass} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={openContactForm} aria-haspopup="dialog" className={classes}>
      {label}
    </button>
  );
}
