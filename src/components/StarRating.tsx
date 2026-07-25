import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({
  rating,
  size = 16,
  showValue = false,
  reviewCount,
  className = '',
}: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.45 && rating - full < 0.75;
  const shownFull = hasHalf ? full : Math.round(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < shownFull) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-amazon-orange text-amazon-orange shrink-0"
        />
      );
    } else if (i === shownFull && hasHalf) {
      stars.push(
        <StarHalf
          key={i}
          size={size}
          className="fill-amazon-orange text-amazon-orange shrink-0"
        />
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-gray-300 shrink-0" />
      );
    }
  }
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="inline-flex items-center">{stars}</div>
      {showValue && (
        <span className="text-sm text-amazon-link hover:text-amazon-linkHover hover:underline cursor-pointer">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="text-sm text-gray-600 ml-0.5">
          {reviewCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}
