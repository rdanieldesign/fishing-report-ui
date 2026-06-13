import { useState } from "react";

type Theme = "primary" | "black" | "white";

interface CollapsiblePanelProps {
  title: string;
  theme?: Theme;
  defaultOpen?: boolean;
  summary?: React.ReactNode;
  children: React.ReactNode;
}

const themeStyles: Record<
  Theme,
  { container: string; button: string; title: string; chevron: string }
> = {
  primary: {
    container: "bg-primary rounded-lg overflow-hidden",
    button: "hover:bg-primary-700",
    title: "text-white mb-0 mr-auto",
    chevron: "text-white/70",
  },
  black: {
    container: "bg-gray-900 rounded-lg overflow-hidden",
    button: "hover:bg-gray-800",
    title: "text-gray-100 mb-0 mr-auto",
    chevron: "text-gray-400",
  },
  white: {
    container: "bg-white border border-gray-200 rounded-lg overflow-hidden",
    button: "hover:bg-gray-50",
    title: "text-gray-900 mb-0 mr-auto",
    chevron: "text-gray-400",
  },
};

export function CollapsiblePanel({
  title,
  theme = "white",
  defaultOpen = true,
  summary,
  children,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = themeStyles[theme];

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-6 py-3 ${styles.button}`}
      >
        <h6 className={styles.title}>{title}</h6>
        {!open && summary}
        <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
      </button>

      <div className={`px-6 pt-3 pb-6 ${open ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}
