import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outline"
    | "ghost"
    | "link"
    | "player";
  size?: "sm" | "md" | "lg" | "icon" | "player";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md",
      tertiary:
        "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 rounded-md",
      outline: "border border-gray-300 hover:bg-gray-100 rounded-md",
      ghost: "hover:bg-gray-100 rounded-md",
      link: "underline-offset-4 hover:underline text-blue-600",
      player: "text-white bg-transparent hover:bg-white/20 rounded-full",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 py-2 px-4",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
      player: "flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 cursor-not-allowed",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
