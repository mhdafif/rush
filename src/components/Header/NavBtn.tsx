import { cn } from "../../lib/utils";

/*======================== Props ======================== */

interface NavBtnProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

/*======================== Return ======================== */

export function NavBtn({ onClick, active, title, children }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors sm:h-8 sm:w-8",
        active ? "text-signal" : "text-text-muted hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}
