import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import LandingLayout from "../../landing-layout"
import BlogContent from "@/components/BlogContent"
import TableOfContents from "@/components/TableOfContents"
import { extractHeadings } from "@/lib/headings"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.tldr ?? post.excerpt,
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)

  return (
    <LandingLayout>
      <div className="min-h-screen bg-white text-black font-mono pt-20 pb-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_200px] gap-12 xl:gap-16 items-start">
            {/* Main content */}
            <div className="min-w-0">
              <article>
                <header className="mb-10 pb-10 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 uppercase tracking-widest">
                    <span>Codeset</span>
                    <span>·</span>
                    <time>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</time>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-medium mb-6 leading-[1.1] tracking-tight">{post.title}</h1>
                  <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                </header>

                {/* Mobile TOC */}
                {headings.length > 0 && (
                  <div className="lg:hidden mb-8">
                    <details className="border border-gray-200 rounded-lg">
                      <summary className="px-4 py-3 text-[10px] font-medium text-gray-400 uppercase tracking-widest cursor-pointer select-none list-none flex items-center justify-between">
                        <span>On this page</span>
                        <span className="text-gray-300">▾</span>
                      </summary>
                      <div className="px-4 pb-4 pt-1">
                        <TableOfContents headings={headings} showLabel={false} />
                      </div>
                    </details>
                  </div>
                )}

                {post.tldr && (
                  <div className="mb-10 border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">TL;DR</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{post.tldr}</p>
                  </div>
                )}

                <BlogContent content={post.content} />
              </article>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block self-start sticky top-24">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>
      </div>
    </LandingLayout>
  )
}
