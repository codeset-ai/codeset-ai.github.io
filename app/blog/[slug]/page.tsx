import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import LandingLayout from "../../landing-layout"
import BlogContent from "@/components/BlogContent"

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

  return (
    <LandingLayout>
      <div className="min-h-screen bg-white text-black font-mono py-24">
        <div className="max-w-4xl mx-auto px-8">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <time>{new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
              </div>
              <h1 className="text-4xl font-medium mb-4">{post.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </header>

            <BlogContent content={post.content} />
          </article>
        </div>
      </div>
    </LandingLayout>
  )
}