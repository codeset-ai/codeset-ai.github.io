import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import LandingLayout from "../landing-layout"

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <LandingLayout>
      <div className="min-h-screen bg-white text-black font-mono py-24">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-medium mb-8">Blog</h1>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Updates from the Codeset team.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="border-b border-gray-200 pb-8">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <time>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</time>
                  </div>
                  <h2 className="text-2xl font-medium mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-gray-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </LandingLayout>
  )
}
