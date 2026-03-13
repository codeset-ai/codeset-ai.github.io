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

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)

  return (
    <LandingLayout>
      <div className="min-h-screen bg-white text-black font-mono py-24">
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
            <div>
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
                  <h1 className="text-4xl sm:text-5xl font-medium mb-6 leading-[1.1] tracking-tight">{post.title}</h1>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                </header>

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
