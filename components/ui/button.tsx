import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: "solid" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function Button({
  variant = "solid",
  size = "default",
  children,
  href,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 rounded-xl font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    solid:
      "bg-pink-500 border border-pink-500 text-white hover:bg-pink-600 hover:border-pink-600 active:bg-pink-700 active:border-pink-700 hover:scale-105 shadow-sm hover:shadow-md",
    outline:
      "bg-white text-pink-600 border border-pink-300 hover:bg-pink-50 active:bg-pink-100 hover:border-pink-400 hover:text-pink-700 shadow-sm",
    ghost:
      "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
  };

  const sizeClasses = {
    default: "h-12 px-6 text-base",
    sm: "h-9 px-3 text-sm",
    lg: "h-14 px-8 text-lg",
    icon: "h-10 w-10",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

