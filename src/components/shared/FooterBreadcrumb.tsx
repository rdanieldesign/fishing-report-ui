import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface FooterBreadcrumbProps {
  text: string;
  to: string;
}

// Mirrors Angular's FooterBreadcrumbComponent: fixed black footer bar with a
// left-arrow and link text. `to` replaces Angular's string[] routerLink array
// since React Router's <Link> accepts a plain path string.
export function FooterBreadcrumb({ text, to }: FooterBreadcrumbProps) {
  return (
    <footer className="h-16 bg-black text-white flex items-center px-4 shrink-0">
      <Link to={to} className="flex items-center gap-2 text-white no-underline hover:opacity-80 text-sm">
        <ChevronLeft size={16} />
        {text}
      </Link>
    </footer>
  );
}
