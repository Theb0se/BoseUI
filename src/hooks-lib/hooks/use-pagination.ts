"use client";

import { useCallback, useMemo, useState } from "react";

export interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
  siblingCount?: number;
}

export type PaginationToken = number | "ellipsis";

export interface UsePaginationReturn {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  range: PaginationToken[];
  setPage: (page: number) => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
}

/**
 * Manages client-side or server-side pagination state with `next`, `prev`,
 * `first`, `last`, index bounds, and an ellipsis-aware `range` array.
 *
 * @param options - `totalItems`, `pageSize`, `initialPage`, and `siblingCount`.
 * @returns Pagination state, navigation helpers, and `range`.
 */
export function usePagination(
  options: UsePaginationOptions
): UsePaginationReturn {
  const {
    totalItems,
    pageSize = 10,
    initialPage = 1,
    siblingCount = 1,
  } = options;

  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const [rawPage, setRawPage] = useState(() =>
    Math.max(1, Math.min(initialPage, totalPages))
  );

  const page = Math.max(1, Math.min(rawPage, totalPages));

  const setPage = useCallback(
    (nextPage: number) => {
      setRawPage(Math.max(1, Math.min(nextPage, totalPages)));
    },
    [totalPages]
  );

  const next = useCallback(() => {
    setRawPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const prev = useCallback(() => {
    setRawPage((p) => Math.max(1, p - 1));
  }, []);

  const first = useCallback(() => setRawPage(1), []);
  const last = useCallback(() => setRawPage(totalPages), [totalPages]);

  const range = useMemo<PaginationToken[]>(() => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const tokens: PaginationToken[] = [1];

    if (showLeftEllipsis) {
      tokens.push("ellipsis");
    } else {
      for (let i = 2; i < leftSibling; i++) tokens.push(i);
    }

    for (let i = Math.max(2, leftSibling); i <= Math.min(totalPages - 1, rightSibling); i++) {
      tokens.push(i);
    }

    if (showRightEllipsis) {
      tokens.push("ellipsis");
    } else {
      for (let i = rightSibling + 1; i < totalPages; i++) tokens.push(i);
    }

    tokens.push(totalPages);
    return tokens;
  }, [page, totalPages, siblingCount]);

  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize;
  const endIndex = Math.min(totalItems, page * pageSize);

  return {
    page,
    totalPages,
    startIndex,
    endIndex,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    range,
    setPage,
    next,
    prev,
    first,
    last,
  };
}
