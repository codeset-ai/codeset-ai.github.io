import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow pt-20">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 mb-12">We'd love to hear from you. Reach out with any questions or inquiries.</p>
          
          <div className="flex flex-col items-center justify-center">
            <a 
              href="mailto:andre@codeset.ai,nuno@codeset.ai" 
              className="flex items-center gap-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-black transition-all text-lg font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}