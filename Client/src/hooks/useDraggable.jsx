import { useEffect, useRef } from "react";

export default function useDraggable({ position, setPosition, width = 340, height = 420 }) {
  const dragging = useRef(false);
  const origin = useRef({ startX: 0, startY: 0, x: 0, y: 0 });

  const clamp = (x, y) => {
    if (typeof window === "undefined") return { x, y };
    const maxX = Math.max(16, window.innerWidth - width - 16);
    const maxY = Math.max(16, window.innerHeight - height - 16);
    return {
      x: Math.min(Math.max(16, x), maxX),
      y: Math.min(Math.max(16, y), maxY)
    };
  };

  const startDrag = (event) => {
    event.preventDefault();
    dragging.current = true;
    origin.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: position.x,
      y: position.y
    };
  };

  useEffect(() => {
    const handleMove = (event) => {
      if (!dragging.current) return;
      const deltaX = event.clientX - origin.current.startX;
      const deltaY = event.clientY - origin.current.startY;
      setPosition(clamp(origin.current.x + deltaX, origin.current.y + deltaY));
    };

    const handleUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [setPosition]);

  return { startDrag };
}
