import React from "react";

export default function Badge({ text, type = "status" }) {
  const className = `${type}-badge badge-${String(text).toLowerCase().replaceAll(" ", "-")}`;
  return <span className={className}>{text}</span>;
}