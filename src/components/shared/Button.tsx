import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "secondary-inverse" | "danger";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  link?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "border border-gray-400 hover:bg-gray-100",
  "secondary-inverse":
    "border border-gray-300 text-gray-300 hover:bg-gray-200 hover:text-gray-800",
  danger: "bg-danger text-white hover:bg-danger-dark",
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className,
  link,
}: ButtonProps) {
  const classes = `px-4 py-2 text-sm rounded ${variantClasses[variant]}${className ? ` ${className}` : ""}`;

  if (link !== undefined) {
    return (
      <Link to={link} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
