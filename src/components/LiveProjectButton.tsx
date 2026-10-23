interface LiveProjectButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function LiveProjectButton({ href, label = 'Live Project', className = '' }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 border-mist px-8 py-3 text-sm font-medium uppercase tracking-widest text-mist transition-colors duration-200 hover:bg-mist/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
