/**
 * Dynamic Page Route
 * Renders pages from Strapi CMS (About, Terms, Privacy, etc.)
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPageBySlug, getAllPages } from '@/lib/strapi-client';
import RichTextRenderer from '@/components/RichTextRenderer';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

interface PageProps {
  params: { slug: string };
}

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug, 'pt-BR', 300);

  if (!page) {
    notFound();
  }

  const coverImageUrl = getStrapiMediaUrl(page.data.attributes.coverImage?.data?.attributes.url);

  return (
    <main className="min-h-screen bg-cyber-dark-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          {/* Page Header */}
          <header className="mb-12 text-center">
            <h1 className="neon-text-purple mb-4 font-display text-heading-1">
              {page.data.attributes.title}
            </h1>
          </header>

          {/* Cover Image */}
          {coverImageUrl && (
            <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-cyber shadow-neon-purple">
              <Image
                src={coverImageUrl}
                alt={page.data.attributes.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Page Content */}
          <div className="card-cyber-glow p-8 md:p-12">
            <RichTextRenderer
              content={page.data.attributes.content}
              className="prose-invert"
            />
          </div>
        </article>
      </div>
    </main>
  );
}

// Generate static params for all pages at build time
export async function generateStaticParams() {
  try {
    const pages = await getAllPages('pt-BR');

    return pages.data.map((page) => ({
      slug: page.attributes.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// SEO metadata from Strapi
export async function generateMetadata({ params }: PageProps) {
  try {
    const page = await getPageBySlug(params.slug, 'pt-BR', 300);

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist.',
      };
    }

    const coverImageUrl = getStrapiMediaUrl(
      page.data.attributes.coverImage?.data?.attributes.url
    );

    return {
      title: page.data.attributes.metaTitle || page.data.attributes.title,
      description: page.data.attributes.metaDescription || page.data.attributes.title,
      openGraph: {
        title: page.data.attributes.metaTitle || page.data.attributes.title,
        description: page.data.attributes.metaDescription || page.data.attributes.title,
        type: 'website',
        ...(coverImageUrl && {
          images: [
            {
              url: coverImageUrl,
              width: 1200,
              height: 630,
              alt: page.data.attributes.title,
            },
          ],
        }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'USE Nerd',
      description: 'E-commerce com Rifas Blockchain',
    };
  }
}
