import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-2xl ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="backdrop-blur-md bg-slate-900/20 border border-slate-900/80 rounded-3xl p-5 flex flex-col h-[420px] animate-pulse">
      <Skeleton className="w-full aspect-[4/3] rounded-2xl mb-4" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <div className="flex gap-1.5 mb-4">
        <Skeleton className="h-4 w-8 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-auto" />
      <div className="flex items-center justify-between pt-4 border-t border-slate-900/40">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
export default Skeleton;
