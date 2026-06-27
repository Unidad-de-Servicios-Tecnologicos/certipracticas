import { useState, useRef, useEffect, useCallback } from 'react';

export const PANEL_RATIO_STORAGE_KEY = 'certipracticas-panel-ratio-v1';

const DEFAULT_LEFT_PERCENT = 45;
const MIN_LEFT_PX = 280;
const MIN_RIGHT_PX = 320;

function loadStoredRatio(fallback: number): number {
  try {
    const raw = localStorage.getItem(PANEL_RATIO_STORAGE_KEY);
    if (raw) {
      const value = parseFloat(raw);
      if (!Number.isNaN(value) && value >= 20 && value <= 80) return value;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

function persistRatio(value: number) {
  try {
    localStorage.setItem(PANEL_RATIO_STORAGE_KEY, String(value));
  } catch {
    /* ignore */
  }
}

export interface UsePanelResizeOptions {
  minLeftPx?: number;
  minRightPx?: number;
  storageKey?: string;
  defaultRatio?: number;
}

export function usePanelResize(options: UsePanelResizeOptions = {}) {
  const minLeftPx = options.minLeftPx ?? MIN_LEFT_PX;
  const minRightPx = options.minRightPx ?? MIN_RIGHT_PX;
  const defaultRatio = options.defaultRatio ?? DEFAULT_LEFT_PERCENT;

  const [leftPercent, setLeftPercent] = useState(() => loadStoredRatio(defaultRatio));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clampWithContainer = useCallback(
    (ratio: number) => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      if (width <= 0) return ratio;
      const minLeft = (minLeftPx / width) * 100;
      const maxLeft = 100 - (minRightPx / width) * 100;
      return Math.max(minLeft, Math.min(maxLeft, ratio));
    },
    [minLeftPx, minRightPx]
  );

  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setLeftPercent((current) => {
      persistRatio(current);
      return current;
    });
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const { left, width } = containerRef.current.getBoundingClientRect();
      const rawRatio = ((clientX - left) / width) * 100;
      setLeftPercent(clampWithContainer(rawRatio));
    },
    [isDragging, clampWithContainer]
  );

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDragging);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onDrag, stopDragging]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setLeftPercent((current) => clampWithContainer(current));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [clampWithContainer]);

  return {
    containerRef,
    leftPercent,
    isDragging,
    startDragging,
    minLeftPx,
    minRightPx,
  };
}
