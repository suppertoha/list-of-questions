import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
	const close = useCallback(() => setIsOpen(false), []);
	return [isOpen, toggle, close];
}