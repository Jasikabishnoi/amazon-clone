import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Shipping', short: '1' },
  { id: 2, name: 'Payment', short: '2' },
  { id: 3, name: 'Review', short: '3' },
  { id: 4, name: 'Place Order', short: '4' },
];

export default function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-between md:justify-center gap-2 text-sm">
      {STEPS.map((st, i) => {
        const done = current > st.id;
        const active = current === st.id;
        return (
          <li key={st.id} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full inline-flex items-center justify-center text-xs md:text-sm font-bold transition-colors ${
                  done
                    ? 'bg-amazon-success text-white'
                    : active
                    ? 'bg-amazon-orange text-black ring-4 ring-amazon-orange/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : st.short}
              </div>
              <span
                className={`hidden sm:inline ${
                  active ? 'text-gray-900 font-bold' : done ? 'text-amazon-success' : 'text-gray-500'
                }`}
              >
                {st.name}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`hidden md:block w-12 lg:w-20 h-0.5 ${
                  done ? 'bg-amazon-success' : 'bg-gray-200'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
