import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/*======================== Props ======================== */

interface CustomDurationDialogProps {
  open: boolean;
  isWords: boolean;
  current: number;
  onConfirm: (val: number) => void;
  onClose: () => void;
}

/*======================== Component ======================== */

export function CustomDurationDialog({
  open,
  isWords,
  current,
  onConfirm,
  onClose,
}: CustomDurationDialogProps) {
  /*======================== UseState ======================== */

  const [value, setValue] = useState(String(current));
  const inputRef = useRef<HTMLInputElement>(null);
  const min = 5;
  const max = isWords ? 500 : 300;
  const label = isWords ? "words" : "seconds";

  /*======================== UseEffect ======================== */

  useEffect(() => {
    if (open) {
      setValue(String(current));
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [open, current]);

  /*======================== Handler ======================== */

  const commit = () => {
    const val = parseInt(value, 10);
    if (!isNaN(val) && val >= min && val <= max) onConfirm(val);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") commit();
    if (e.key === "Escape") onClose();
  };

  /*======================== Return ======================== */

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-6 font-mono shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xs tracking-widest text-zinc-500 uppercase">
            custom {label}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-1 flex items-center gap-3">
          <input
            ref={inputRef}
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 [appearance:textfield] rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-center font-mono text-lg text-orange-400 transition-colors outline-none focus:border-orange-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-xs text-zinc-600">{label}</span>
        </div>
        <div className="mb-5 text-[10px] text-zinc-700">
          {min}–{max} {label}
        </div>

        <div className="flex gap-2">
          <button
            onClick={commit}
            className="flex-1 cursor-pointer rounded-lg bg-orange-600 py-2 text-xs text-white transition-colors hover:bg-orange-500"
          >
            confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg bg-zinc-800 py-2 text-xs text-zinc-400 transition-colors hover:bg-zinc-700"
          >
            cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
