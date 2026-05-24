import { useEffect, useRef } from "react";

export const useHideOnClick = (onClose, isOpen = false) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof onClose !== "function" || !isOpen) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, isOpen]);

  return ref;
};