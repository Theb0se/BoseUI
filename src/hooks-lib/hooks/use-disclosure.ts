"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseDisclosureOptions {
  /** Initial open state (default: `false`). */
  defaultOpen?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Callback fired when the disclosure opens. */
  onOpen?: () => void;
  /** Callback fired when the disclosure closes. */
  onClose?: () => void;
  /** Callback fired whenever open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Manages open/close/toggle state for modals, drawers, popovers, and accordions.
 * Supports both uncontrolled (`defaultOpen`) and controlled (`isOpen` + `onOpenChange`) modes.
 *
 * @param options - Configuration and lifecycle callbacks.
 * @returns `{ isOpen, open, close, toggle }`.
 */
export function useDisclosure(
  options: UseDisclosureOptions = {}
): UseDisclosureReturn {
  const {
    defaultOpen = false,
    isOpen: controlledOpen,
    onOpen,
    onClose,
    onOpenChange,
  } = options;

  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const callbacksRef = useRef({ onOpen, onClose, onOpenChange });
  useEffect(() => {
    callbacksRef.current = { onOpen, onClose, onOpenChange };
  }, [onOpen, onClose, onOpenChange]);

  const setOpenState = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      callbacksRef.current.onOpenChange?.(next);
      if (next) {
        callbacksRef.current.onOpen?.();
      } else {
        callbacksRef.current.onClose?.();
      }
    },
    [isControlled]
  );

  const open = useCallback(() => {
    if (!isOpenRef.current) {
      setOpenState(true);
    }
  }, [setOpenState]);

  const close = useCallback(() => {
    if (isOpenRef.current) {
      setOpenState(false);
    }
  }, [setOpenState]);

  const toggle = useCallback(() => {
    setOpenState(!isOpenRef.current);
  }, [setOpenState]);

  return { isOpen, open, close, toggle };
}
