import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Codeset. All rights reserved.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">Home</Link>
            <Link href="/pricing" className="text-sm text-gray-500 hover:text-black transition-colors">Pricing</Link>
            <Link href="/team" className="text-sm text-gray-500 hover:text-black transition-colors">Team</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
            <Link href="https://calendly.com/andre-codeset/intro-to-codeset" className="text-sm text-gray-500 hover:text-black transition-colors">Book a Demo</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}