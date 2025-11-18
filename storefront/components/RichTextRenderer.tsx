/**
 * Rich Text Renderer Component
 * Renders Strapi markdown content with proper styling
 */

'use client';

import ReactMarkdown from 'react-markdown';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-img:rounded-lg prose-img:shadow-lg ${className}`}>
      <ReactMarkdown
        components={{
          // Custom heading styling
          h1: ({ node, ...props }) => (
            <h1 className="mb-6 mt-8 text-4xl font-bold text-gray-900" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="mb-4 mt-6 text-3xl font-bold text-gray-900" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="mb-3 mt-4 text-2xl font-bold text-gray-900" {...props} />
          ),
          // Custom paragraph styling
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed text-gray-700" {...props} />
          ),
          // Custom link styling
          a: ({ node, ...props }) => (
            <a
              className="text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            />
          ),
          // Custom list styling
          ul: ({ node, ...props }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed text-gray-700" {...props} />
          ),
          // Custom blockquote styling
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-primary bg-gray-50 p-4 italic text-gray-700"
              {...props}
            />
          ),
          // Custom code styling
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800" {...props} />
            ) : (
              <code className="block rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100 overflow-x-auto" {...props} />
            ),
          // Custom image styling
          img: ({ node, ...props }) => (
            <img
              className="my-6 rounded-lg shadow-lg w-full h-auto"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
