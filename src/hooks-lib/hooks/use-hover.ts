"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether the pointer is currently hovering over a referenced DOM element.
 * Cleans up `mouseenter` and `mouseleave` listeners automatically.
 *
 * @param ref - React ref attached to the target element.
 * @returns `true` while the element is hovered.
 */
export function useHover<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return isHovered;
}
