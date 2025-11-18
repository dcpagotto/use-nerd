/**
 * Blog Card Component
 * Displays a blog post preview card
 */

import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl, formatStrapiDate, getStrapiExcerpt } from '@/lib/strapi-utils';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  category?: string;
  publishedAt: string;
  featured?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = getStrapiMediaUrl(post.coverImage);
  const excerpt = post.excerpt || (post.content ? getStrapiExcerpt(post.content, 120) : '');

  const categoryColors: Record<string, string> = {
    news: 'bg-neon-blue/90 text-cyber-dark border border-neon-blue shadow-neon-blue-sm',
    tutorial: 'bg-neon-green/90 text-cyber-dark border border-neon-green shadow-neon-green',
    announcement: 'bg-neon-yellow/90 text-cyber-dark border border-neon-yellow',
    raffle: 'bg-neon-purple/90 text-white border border-neon-purple shadow-neon-purple-sm',
    winner: 'bg-neon-pink/90 text-white border border-neon-pink shadow-neon-pink',
    other: 'bg-gray-cyber-700/90 text-white border border-gray-cyber-600',
  };

  const categoryColor = categoryColors[post.category || 'other'] || categoryColors.other;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/20 shadow-cyber transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-1 focus-cyber"
    >
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute left-4 top-4 z-10 rounded-cyber bg-gradient-cyber px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg animate-glow-pulse backdrop-blur-sm">
          ⭐ Destaque
        </div>
      )}

      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-cyber-dark-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-cyber">
            <span className="text-6xl animate-float">📰</span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-100 via-transparent to-transparent" />

        {/* Category Badge */}
        {post.category && (
          <div
            className={`absolute bottom-3 right-3 z-10 rounded-cyber px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${categoryColor}`}
          >
            {post.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-white line-clamp-2 group-hover:text-gradient-cyber transition-all">
          {post.title}
        </h3>

        {excerpt && (
          <p className="mb-4 text-sm text-gray-cyber-300 line-clamp-3">{excerpt}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between border-t border-neon-purple/20 pt-4 text-xs text-gray-cyber-400 font-mono">
          <span>{post.author || 'USE Nerd'}</span>
          <span>{formatStrapiDate(post.publishedAt)}</span>
        </div>
      </div>

      {/* Hover Effect - Neon Border */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber transition-all duration-300 group-hover:h-2 shadow-neon-purple-sm" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
