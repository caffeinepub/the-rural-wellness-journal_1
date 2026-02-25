import { BlogCategory } from '../../backend';

interface CategoryBadgeProps {
  category: BlogCategory;
  size?: 'sm' | 'md';
}

const categoryConfig: Record<BlogCategory, { label: string; className: string }> = {
  [BlogCategory.personalStory]: {
    label: 'Personal Story',
    className: 'bg-terracotta/15 text-terracotta border border-terracotta/25',
  },
  [BlogCategory.interview]: {
    label: 'Interview',
    className: 'bg-sage/15 text-sage border border-sage/25',
  },
  [BlogCategory.clinicalObservation]: {
    label: 'Clinical Observation',
    className: 'bg-warm-brown/10 text-warm-brown border border-warm-brown/20',
  },
};

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
}
