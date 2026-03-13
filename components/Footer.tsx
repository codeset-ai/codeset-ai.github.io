import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Codeset. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Codeset Platform</p>
              <div className="flex flex-col gap-2">
                <Link href="/datasets" className="text-sm text-gray-500 hover:text-black transition-colors">Datasets</Link>
                <Link href="https://docs.codeset.ai" className="text-sm text-gray-500 hover:text-black transition-colors">Documentation</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About Us</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog" className="text-sm text-gray-500 hover:text-black transition-colors">Blog</Link>
                <Link href="/team" className="text-sm text-gray-500 hover:text-black transition-colors">Team</Link>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
