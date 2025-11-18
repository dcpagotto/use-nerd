/**
 * Blog List Page
 * Displays all blog posts with category filtering
 */

import { getBlogPosts } from '@/lib/strapi-client';
import BlogCard from '@/components/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';

interface BlogPageProps {
  searchParams: { category?: string };
}

// ISR: Revalidate every 3 minutes
export const revalidate = 180;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getBlogPosts({
    category: searchParams.category,
    locale: 'pt-BR',
    sort: 'publishedAt:desc',
    revalidate: 180,
  });

  return (
    <main className="min-h-screen bg-cyber-dark-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="neon-text-purple mb-4 font-display text-heading-1">
            Blog & Notícias
          </h1>
          <p className="text-gray-cyber-300 text-lg">
            Novidades, guias e atualizações sobre rifas e produtos
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter currentCategory={searchParams.category} />
        </div>

        {/* Blog Posts Grid */}
        {posts.data && posts.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  id: post.id,
                  slug: post.attributes.slug,
                  title: post.attributes.title,
                  excerpt: post.attributes.excerpt,
                  content: post.attributes.content,
                  coverImage: post.attributes.coverImage?.data?.attributes.url,
                  author: post.attributes.author,
                  category: post.attributes.category,
                  publishedAt: post.attributes.publishedAt!,
                  featured: post.attributes.featured,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="card-cyber-glow py-20 text-center">
            <div className="mb-4 text-6xl">📰</div>
            <p className="text-gray-cyber-300 text-lg">
              {searchParams.category
                ? 'Nenhum post encontrado nesta categoria.'
                : 'Nenhum post publicado ainda. Volte em breve!'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// SEO metadata
export async function generateMetadata({ searchParams }: BlogPageProps) {
  const categoryLabel = searchParams.category
    ? ` - ${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)}`
    : '';

  return {
    title: `Blog${categoryLabel} | USE Nerd`,
    description:
      'Notícias, guias e atualizações sobre rifas blockchain, produtos e muito mais.',
    openGraph: {
      title: `Blog${categoryLabel} | USE Nerd`,
      description:
        'Notícias, guias e atualizações sobre rifas blockchain, produtos e muito mais.',
      type: 'website',
    },
  };
}
