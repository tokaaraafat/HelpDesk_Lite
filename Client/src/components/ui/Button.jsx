import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger"
  };

  const sizeClasses = {
    small: "btn-small",
    medium: "btn-medium",
    large: "btn-large"
  };

  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <button className={`${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}