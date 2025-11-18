/**
 * Blog Post Detail Page
 * Displays individual blog post with full content
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/strapi-client';
import RichTextRenderer from '@/components/RichTextRenderer';
import { getStrapiMediaUrl, formatStrapiDate } from '@/lib/strapi-utils';

interface BlogPostProps {
  params: { slug: string };
}

// ISR: Revalidate every 3 minutes
export const revalidate = 180;

export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = await getBlogPostBySlug(params.slug, 'pt-BR', 180);

  if (!post) {
    notFound();
  }

  const coverImageUrl = getStrapiMediaUrl(post.data.attributes.coverImage?.data?.attributes.url);

  const categoryColors: Record<string, string> = {
    news: 'bg-blue-500',
    tutorial: 'bg-green-500',
    announcement: 'bg-yellow-500',
    raffle: 'bg-purple-500',
    winner: 'bg-pink-500',
    other: 'bg-gray-500',
  };

  const categoryColor =
    categoryColors[post.data.attributes.category || 'other'] || categoryColors.other;

  return (
    <main className="min-h-screen bg-cyber-dark-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-gray-cyber-300 transition-colors hover:text-neon-purple"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Voltar para o Blog</span>
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            {/* Cover Image */}
            {coverImageUrl && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-cyber shadow-neon-purple">
                <Image
                  src={coverImageUrl}
                  alt={post.data.attributes.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Meta Info */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-cyber-300">
              {post.data.attributes.category && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold text-white ${categoryColor}`}
                >
                  {post.data.attributes.category}
                </span>
              )}
              <span>{formatStrapiDate(post.data.attributes.publishedAt!)}</span>
              <span>•</span>
              <span>{post.data.attributes.author || 'USE Nerd'}</span>
            </div>

            {/* Title */}
            <h1 className="neon-text-purple mb-4 font-display text-heading-1">
              {post.data.attributes.title}
            </h1>

            {/* Excerpt */}
            {post.data.attributes.excerpt && (
              <p className="text-xl text-gray-cyber-300">{post.data.attributes.excerpt}</p>
            )}
          </header>

          {/* Post Content */}
          <div className="card-cyber-glow mb-8 p-8 md:p-12">
            <RichTextRenderer
              content={post.data.attributes.content}
              className="prose-invert"
            />
          </div>

          {/* Tags */}
          {post.data.attributes.tags && post.data.attributes.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.data.attributes.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neon-purple/30 bg-neon-purple/5 px-4 py-2 text-sm font-semibold text-neon-purple"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share & Back */}
          <div className="flex items-center justify-between border-t border-gray-cyber-700 pt-8">
            <Link href="/blog" className="btn-neon-outline">
              Ver Todos os Posts
            </Link>

            <div className="flex items-center gap-2 text-gray-cyber-300">
              <span>Compartilhar:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.data.attributes.title
                )}&url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 transition-colors hover:bg-neon-blue/10 hover:text-neon-blue"
                aria-label="Compartilhar no Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 transition-colors hover:bg-neon-blue/10 hover:text-neon-blue"
                aria-label="Compartilhar no Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts('pt-BR');

    return posts.data.map((post) => ({
      slug: post.attributes.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// SEO metadata from Strapi
export async function generateMetadata({ params }: BlogPostProps) {
  try {
    const post = await getBlogPostBySlug(params.slug, 'pt-BR', 180);

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const coverImageUrl = getStrapiMediaUrl(
      post.data.attributes.coverImage?.data?.attributes.url
    );

    return {
      title: post.data.attributes.metaTitle || post.data.attributes.title,
      description: post.data.attributes.metaDescription || post.data.attributes.excerpt,
      authors: [{ name: post.data.attributes.author || 'USE Nerd' }],
      openGraph: {
        title: post.data.attributes.title,
        description: post.data.attributes.excerpt || post.data.attributes.title,
        type: 'article',
        publishedTime: post.data.attributes.publishedAt,
        authors: [post.data.attributes.author || 'USE Nerd'],
        ...(coverImageUrl && {
          images: [
            {
              url: coverImageUrl,
              width: 1200,
              height: 630,
              alt: post.data.attributes.title,
            },
          ],
        }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog | USE Nerd',
      description: 'Notícias e atualizações',
    };
  }
}
