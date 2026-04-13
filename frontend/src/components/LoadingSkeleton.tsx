export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
            </div>
            <div className="h-5 bg-slate-200 rounded-full w-20 ml-3" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-slate-100 rounded-full w-full" />
            <div className="h-3 bg-slate-100 rounded-full w-4/5" />
          </div>
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <div className="h-7 bg-slate-100 rounded-lg w-20" />
            <div className="ml-auto flex gap-2">
              <div className="h-7 bg-slate-100 rounded-lg w-14" />
              <div className="h-7 bg-slate-100 rounded-lg w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
