import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface FooterBreadcrumbProps {
  text: string;
  to: string;
}

// Fixed black footer bar with a left-arrow and link text.
export function FooterBreadcrumb({ text, to }: FooterBreadcrumbProps) {
  return (
    <footer className="h-16 bg-gray-900 text-white flex items-center shrink-0 px-4 md:px-8 mt-0 -mb-8 -mx-4 md:-mx-8">
      <Link
        to={to}
        className="flex items-center gap-2 text-white no-underline hover:opacity-80"
      >
        <ChevronLeft size={16} />
        {text}
      </Link>
    </footer>
  );
}
