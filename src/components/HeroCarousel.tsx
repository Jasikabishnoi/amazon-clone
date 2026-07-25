import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  to: string;
  bg: string;
  accent: string;
  imageUrl: string;
}

const slides: Slide[] = [
  {
    title: 'Summer Sale — Up to 50% Off',
    subtitle: 'Electronics, fashion, home essentials and more.',
    cta: 'Shop the Deals',
    to: '/search',
    bg: 'from-rose-500 via-pink-500 to-amber-400',
    accent: 'bg-amazon-yellow text-black',
    imageUrl: categories.find((c) => c.id === 'electronics')!.heroImage!,
  },
  {
    title: 'New Fashion Arrivals',
    subtitle: 'Warm-weather wardrobe staples starting at $19.',
    cta: 'Explore Fashion',
    to: '/category/fashion',
    bg: 'from-indigo-500 via-sky-500 to-emerald-400',
    accent: 'bg-white text-gray-900',
    imageUrl: categories.find((c) => c.id === 'fashion')!.heroImage!,
  },
  {
    title: 'Home Makeover Essentials',
    subtitle: 'Refresh your space — free shipping on orders over $25.',
    cta: 'Shop Home',
    to: '/category/home-kitchen',
    bg: 'from-amber-400 via-orange-500 to-rose-500',
    accent: 'bg-black text-white',
    imageUrl: categories.find((c) => c.id === 'home-kitchen')!.heroImage!,
  },
  {
    title: 'Beauty Steals You’ll Love',
    subtitle: 'Fan-favorite serums, haircare, and beauty tools.',
    cta: 'Discover Beauty',
    to: '/category/beauty',
    bg: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    accent: 'bg-amazon-yellow text-black',
    imageUrl: categories.find((c) => c.id === 'beauty')!.heroImage!,
  },
];

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`relative w-full shrink-0 h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] bg-gradient-to-br ${s.bg}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
              style={{ backgroundImage: `url(${s.imageUrl})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-white/0" aria-hidden />
            <div className="absolute inset-0 container flex flex-col justify-center items-start text-white px-4 sm:px-6">
              <div className="animate-fade-in max-w-xl">
                <div className="text-xs uppercase tracking-[0.3em] opacity-90 mb-3">
                  Limited Time Offer
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-sm">
                  {s.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl opacity-95 mb-6 drop-shadow">
                  {s.subtitle}
                </p>
                <Link
                  to={s.to}
                  className={`inline-flex items-center px-6 py-3 rounded-full font-semibold shadow-xl transition-transform hover:scale-[1.03] active:scale-95 ${s.accent}`}
                >
                  {s.cta} <ChevronRight size={20} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-14 md:w-12 md:h-16 rounded bg-white/60 hover:bg-white/90 text-gray-900 flex items-center justify-center backdrop-blur-sm transition-colors shadow"
        aria-label="Previous"
      >
        <ChevronLeft size={26} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-14 md:w-12 md:h-16 rounded bg-white/60 hover:bg-white/90 text-gray-900 flex items-center justify-center backdrop-blur-sm transition-colors shadow"
        aria-label="Next"
      >
        <ChevronRight size={26} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === idx ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white/90'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
