"use client";

import { useCallback, useState } from "react";

/**
 * Manages a boolean state with a stable `toggle` handler and explicit setter.
 * Calling `toggle()` flips the boolean; passing a boolean sets it explicitly.
 *
 * @param initialValue - Initial boolean state (default: `false`).
 * @returns Tuple of `[value, toggle, setValue]`.
 */
export function useToggle(
  initialValue = false
): [boolean, (nextValue?: boolean) => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(Boolean(initialValue));

  const toggle = useCallback((nextValue?: boolean) => {
    if (typeof nextValue === "boolean") {
      setValue(nextValue);
    } else {
      setValue((prev) => !prev);
    }
  }, []);

  return [value, toggle, setValue];
}
