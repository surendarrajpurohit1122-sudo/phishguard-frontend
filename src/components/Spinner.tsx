import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

const Spinner = ({ size = 24, label = "Analyzing Vectors...", className = "" }: SpinnerProps) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <Loader2 size={size} className="animate-spin text-primary" />
    {label && <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{label}</span>}
  </div>
);

export default Spinner;
