import React from "react";

export default function Select({ options = [], children, ...props }) {
  return (
    <select className="input-base" {...props}>
      {options.length > 0
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
}