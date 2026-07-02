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
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors",
        active ? "text-orange-500" : "text-zinc-500 hover:text-zinc-200"
      )}
    >
      {children}
    </button>
  );
}
