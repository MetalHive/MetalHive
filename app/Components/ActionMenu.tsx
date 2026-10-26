"use client"

import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  /** Red text, for destructive actions. */
  danger?: boolean;
  disabled?: boolean;
}

/**
 * Row-level "⋮" menu: a single icon button that opens a small dropdown of
 * actions. Closes on outside click, Escape, or after choosing an item.
 */
export default function ActionMenu({
  items,
  label = 'Actions',
  disabled = false,
}: {
  items: ActionMenuItem[];
  label?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#737780] hover:bg-gray-100 hover:text-[#17181a] transition-colors disabled:opacity-50"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-[#ececec] bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick();
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-[#17181a] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
