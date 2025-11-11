export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0a192f] to-[#112240]">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-transparent border-t-[#3b82f6] animate-spin" />
        <div className="absolute -right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_12px_3px_rgba(96,165,250,0.7)]" />
      </div>
      <p className="mt-4 text-slate-200/80 text-sm font-medium tracking-wide">
        Loading…
      </p>
    </div>
  );
}
