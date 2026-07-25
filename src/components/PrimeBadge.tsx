import { Check } from 'lucide-react';

export default function PrimeBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold tracking-wide text-[#00A8E1] uppercase ${className}`}
    >
      <Check size={12} strokeWidth={3} className="bg-[#00A8E1] text-white rounded-full p-0" />
      prime
    </span>
  );
}
