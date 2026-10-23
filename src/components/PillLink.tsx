import { ArrowUpRight } from 'lucide-react';

interface PillLinkProps {
  href: string;
  label: string;
  tone?: 'dark' | 'light';
}

const tones = {
  dark: 'border-mist/30 text-mist hover:border-mist hover:bg-mist/10 focus-visible:outline-mist',
  light: 'border-ink/20 text-ink hover:border-ink hover:bg-ink/5 focus-visible:outline-ink',
};

export default function PillLink({ href, label, tone = 'dark' }: PillLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full border px-5 text-xs font-medium uppercase tracking-widest transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm ${tones[tone]}`}
    >
      {label}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
