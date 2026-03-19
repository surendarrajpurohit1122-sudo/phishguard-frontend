interface SkeletonLoaderProps {
  rows?: number;
  className?: string;
}

const SkeletonLoader = ({ rows = 3, className = "" }: SkeletonLoaderProps) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-border/50 rounded" style={{ width: `${100 - i * 15}%` }} />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
