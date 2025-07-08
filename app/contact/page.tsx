import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactForm() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />
      <main className="flex-1 flex flex-col pt-20">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdwHHSsALfFovJ7uTPxnRZDhaQtMynaiLe5FAhufU4HHog86w/viewform?embedded=true" width="100%" height="1250px" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
}
