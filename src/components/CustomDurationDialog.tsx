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
        className="border-line bg-panel w-72 rounded-xl border p-6 font-mono"
      >
        <DialogHeader>
          <DialogTitle className="text-text-muted text-xs tracking-widest uppercase">
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
            className="border-line bg-panel-raised text-signal focus:border-signal flex-1 [appearance:textfield] rounded-lg border px-3 py-2 text-center font-mono text-lg transition-colors outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-text-muted text-xs">{label}</span>
        </div>
        <div className="text-text-muted mb-5 text-[10px]">
          {min}–{max} {label}
        </div>

        <div className="flex gap-2">
          <button
            onClick={commit}
            className="bg-signal text-on-signal flex-1 cursor-pointer rounded-lg py-2 text-xs transition-all hover:brightness-95"
          >
            confirm
          </button>
          <button
            onClick={onClose}
            className="bg-panel-raised text-text-muted hover:bg-line flex-1 cursor-pointer rounded-lg py-2 text-xs transition-colors"
          >
            cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
