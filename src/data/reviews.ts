import type { Review } from '@/types';

const users = ['Alex M.', 'Jamie K.', 'Sam W.', 'Jordan L.', 'Taylor R.', 'Casey P.', 'Morgan H.', 'Riley T.', 'Avery S.', 'Quinn B.'];
const titlesGood = ['Absolutely love it!', 'Exceeds expectations', 'Great value', 'Perfect purchase', 'Highly recommended', 'Could not be happier'];
const titlesMid = ['Good but not perfect', 'Solid, with minor issues', 'Pretty decent overall', 'Works as expected'];
const bodiesGood = [
  'Arrived quickly and well packaged. Build quality is outstanding and it works exactly as advertised. Would buy again without hesitation.',
  'This has quickly become one of my favorite purchases this year. The attention to detail is clear, and the design is beautiful.',
  'I researched a lot before buying this one, and I’m glad I did. It outperforms competitors in the same price range easily.',
  'Gift for my partner and they absolutely loved it. Quality materials, feels premium, and functions flawlessly.',
];
const bodiesMid = [
  'Overall a solid product. No dealbreakers but there are a few small things that could be improved for the price.',
  'Works fine for what I need. Not mind-blowing, but dependable. Shipping was fast.',
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeReviewsForProduct(productId: string, n: number, baseSeed: number): Review[] {
  const rand = seedRandom(baseSeed);
  const out: Review[] = [];
  for (let i = 0; i < n; i++) {
    const great = rand() < 0.7;
    const rating = great ? (rand() < 0.6 ? 5 : 4) : rand() < 0.7 ? 3 : 2;
    const titlePool = great ? titlesGood : titlesMid;
    const bodyPool = great ? bodiesGood : bodiesMid;
    out.push({
      id: `r-${productId}-${i}`,
      productId,
      userName: users[Math.floor(rand() * users.length)],
      rating,
      title: titlePool[Math.floor(rand() * titlePool.length)],
      body: bodyPool[Math.floor(rand() * bodyPool.length)],
      date: new Date(Date.now() - Math.floor(rand() * 180) * 86400000).toISOString().slice(0, 10),
      verified: rand() > 0.15,
      helpful: Math.floor(rand() * 250),
    });
  }
  return out;
}

export const reviews: Review[] = [
  ...makeReviewsForProduct('p-1001', 24, 101),
  ...makeReviewsForProduct('p-1002', 30, 102),
  ...makeReviewsForProduct('p-1003', 18, 103),
  ...makeReviewsForProduct('p-1004', 14, 104),
  ...makeReviewsForProduct('p-2001', 20, 201),
  ...makeReviewsForProduct('p-2002', 28, 202),
  ...makeReviewsForProduct('p-2003', 12, 203),
  ...makeReviewsForProduct('p-2004', 16, 204),
  ...makeReviewsForProduct('p-3001', 22, 301),
  ...makeReviewsForProduct('p-3002', 9, 302),
  ...makeReviewsForProduct('p-3003', 26, 303),
  ...makeReviewsForProduct('p-4001', 32, 401),
  ...makeReviewsForProduct('p-4002', 18, 402),
  ...makeReviewsForProduct('p-5001', 40, 501),
  ...makeReviewsForProduct('p-5002', 36, 502),
  ...makeReviewsForProduct('p-6001', 15, 601),
  ...makeReviewsForProduct('p-6002', 32, 602),
  ...makeReviewsForProduct('p-7001', 12, 701),
  ...makeReviewsForProduct('p-7002', 22, 702),
  ...makeReviewsForProduct('p-8001', 20, 801),
  ...makeReviewsForProduct('p-8002', 14, 802),
];

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRatingBreakdown(productId: string) {
  const rs = getReviewsByProduct(productId);
  const counts = [0, 0, 0, 0, 0];
  rs.forEach((r) => {
    const idx = Math.max(1, Math.min(5, r.rating)) - 1;
    counts[idx]++;
  });
  return {
    total: rs.length,
    stars: counts.reverse().map((c, i) => ({ stars: 5 - i, count: c, percent: rs.length ? Math.round((c / rs.length) * 100) : 0 })),
  };
}
