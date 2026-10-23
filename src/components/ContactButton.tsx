interface ContactButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function ContactButton({ href = '#contact', label = 'Contact Me', className = '' }: ContactButtonProps) {
  return (
    <a
      href={href}
      className={`btn-contact inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
    >
      {label}
    </a>
  );
}
