/**
 * Category Filter Component
 * Filter blog posts by category
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  currentCategory?: string;
}

const categories = [
  { value: '', label: 'Todos' },
  { value: 'news', label: 'Notícias' },
  { value: 'tutorial', label: 'Tutoriais' },
  { value: 'announcement', label: 'Anúncios' },
  { value: 'raffle', label: 'Rifas' },
  { value: 'winner', label: 'Ganhadores' },
  { value: 'other', label: 'Outros' },
];

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryChange(cat.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-primary/50 ${
            (currentCategory || '') === cat.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
