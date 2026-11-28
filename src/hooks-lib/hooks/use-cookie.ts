"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseCookieOptions {
  /** Expiration in days from now (default: `7`). */
  days?: number;
  /** Cookie path (default: `"/"`). */
  path?: string;
  /** SameSite attribute (default: `"Lax"`). */
  sameSite?: "Strict" | "Lax" | "None";
  /** Secure flag. */
  secure?: boolean;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    if (part.startsWith(encodedName)) {
      return decodeURIComponent(part.slice(encodedName.length));
    }
  }
  return null;
}

/**
 * Reads, writes, and deletes browser cookies in an SSR-safe manner.
 * Hydrates from `document.cookie` after mount to prevent hydration mismatches.
 *
 * @param name - Cookie name.
 * @param defaultValue - Fallback value when cookie is absent or during SSR.
 * @returns Tuple of `[value, setCookie, deleteCookie]`.
 */
export function useCookie(
  name: string,
  defaultValue = ""
): [string, (newValue: string, options?: UseCookieOptions) => void, () => void] {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    const existing = readCookie(name);
    if (existing !== null) {
      setValue(existing);
    } else {
      setValue(defaultValue);
    }
  }, [name, defaultValue]);

  const updateCookie = useCallback(
    (newValue: string, options: UseCookieOptions = {}) => {
      setValue(newValue);
      if (typeof document === "undefined") return;

      const {
        days = 7,
        path = "/",
        sameSite = "Lax",
        secure = false,
      } = options;

      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(
        newValue
      )}; expires=${expires}; path=${path}; SameSite=${sameSite}`;
      if (secure) cookieStr += "; Secure";

      document.cookie = cookieStr;
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    setValue(defaultValue);
    if (typeof document === "undefined") return;
    document.cookie = `${encodeURIComponent(
      name
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }, [name, defaultValue]);

  return [value, updateCookie, deleteCookie];
}
