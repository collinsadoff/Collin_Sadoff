"use client";

import { useMemo } from "react";

/**
 * Justified-rows layout, the same model a photo wall uses.
 *
 * Every item in a row is scaled to one shared height, and widths stay
 * proportional to each item's aspect ratio, so the row fills the container
 * exactly. Items are added to a row until adding one more would take the row
 * FURTHER from the target height than stopping would - that comparison, rather
 * than a plain "stop once we're under target", is what keeps rows visually
 * even instead of alternating tall and short.
 *
 * The last row is NOT stretched - a short final row keeps the target height
 * and simply ends early, which is what the reference layout does.
 */

export type JustifiedItem = {
  /** width / height */
  aspectRatio: number;
};

export type PlacedItem<T> = {
  item: T;
  index: number;
  width: number;
  height: number;
};

export type JustifiedRow<T> = {
  items: PlacedItem<T>[];
  height: number;
  /** true when the row was not justified (the final, partially-filled row). */
  isLastRow: boolean;
};

export type JustifiedLayout<T> = {
  rows: JustifiedRow<T>[];
  /** Total layout height including gutters, for reserving space. */
  totalHeight: number;
};

export function computeJustifiedLayout<T extends JustifiedItem>(
  items: T[],
  containerWidth: number,
  targetRowHeight: number,
  gutter: number,
): JustifiedLayout<T> {
  if (!items.length || containerWidth <= 0) {
    return { rows: [], totalHeight: 0 };
  }

  const rows: JustifiedRow<T>[] = [];
  let current: { item: T; index: number }[] = [];
  let ratioSum = 0;

  const commit = (isLastRow: boolean) => {
    if (!current.length) return;

    // Width available to the media once gutters are removed.
    const gutters = gutter * (current.length - 1);
    const usable = containerWidth - gutters;

    // Height that makes this row exactly fill `usable`.
    const justifiedHeight = usable / ratioSum;

    // The final row keeps the target height rather than blowing up to fill
    // the width with one or two items.
    const height = isLastRow
      ? Math.min(justifiedHeight, targetRowHeight)
      : justifiedHeight;

    const placed: PlacedItem<T>[] = current.map(({ item, index }) => ({
      item,
      index,
      width: height * item.aspectRatio,
      height,
    }));

    // Justified rows must land on the container width exactly; floating point
    // and rounding can leave a sliver, so the last tile absorbs the remainder.
    if (!isLastRow && placed.length) {
      const total =
        placed.reduce((sum, p) => sum + p.width, 0) + gutters;
      const drift = containerWidth - total;
      placed[placed.length - 1].width += drift;
    }

    rows.push({ items: placed, height, isLastRow });
    current = [];
    ratioSum = 0;
  };

  /** Row height if `count` items summing to `sum` shared a justified row. */
  const heightFor = (sum: number, count: number) =>
    (containerWidth - gutter * Math.max(count - 1, 0)) / sum;

  items.forEach((item, index) => {
    // Guard against a bad aspectRatio in the data file taking the grid down.
    const ratio =
      Number.isFinite(item.aspectRatio) && item.aspectRatio > 0
        ? item.aspectRatio
        : 16 / 9;

    const heightBefore = current.length
      ? heightFor(ratioSum, current.length)
      : Infinity;
    const heightAfter = heightFor(ratioSum + ratio, current.length + 1);

    // Adding this item takes the row past the target. Keep it only if that
    // lands closer to the target than stopping here would.
    if (
      heightAfter < targetRowHeight &&
      current.length > 0 &&
      Math.abs(heightBefore - targetRowHeight) <
        Math.abs(heightAfter - targetRowHeight)
    ) {
      commit(false);
    }

    current.push({ item, index });
    ratioSum += ratio;

    // A single item already shorter than the target is a row on its own.
    if (heightFor(ratioSum, current.length) <= targetRowHeight) {
      commit(false);
    }
  });

  commit(true);

  const totalHeight =
    rows.reduce((sum, row) => sum + row.height, 0) +
    gutter * Math.max(rows.length - 1, 0);

  return { rows, totalHeight };
}

export function useJustifiedLayout<T extends JustifiedItem>(
  items: T[],
  containerWidth: number,
  targetRowHeight: number,
  gutter: number,
): JustifiedLayout<T> {
  return useMemo(
    () =>
      computeJustifiedLayout(items, containerWidth, targetRowHeight, gutter),
    [items, containerWidth, targetRowHeight, gutter],
  );
}
