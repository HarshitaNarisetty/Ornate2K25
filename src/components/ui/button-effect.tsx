
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonEffectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
}

const ButtonEffect = React.forwardRef<HTMLButtonElement, ButtonEffectProps>(
  ({ 
    children, 
    className, 
    variant = "primary", 
    size = "md", 
    icon, 
    iconPosition = "left",
    asChild = false,
    ...props 
  }, ref) => {
    const variantClasses = {
      primary: "bg-primary text-primary-foreground shadow-md hover:shadow-xl hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-lg"
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-button-glow"></span>
        <span className="relative flex items-center gap-2">
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      </Comp>
    );
  }
);

ButtonEffect.displayName = "ButtonEffect";

export { ButtonEffect };
