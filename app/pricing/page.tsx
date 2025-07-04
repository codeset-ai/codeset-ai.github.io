import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow pt-20">
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Flexible Pricing for Every Team</h1>
          <p className="text-lg text-gray-600 mb-16">Choose the plan that's right for your needs.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pricing Cards */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Basic</h2>
              <p className="text-5xl font-bold mb-2">$0.05<span className="text-xl font-medium text-gray-500">/session minute</span></p>
              <p className="text-gray-500 mb-6">For individual researchers and small teams.</p>
              <ul className="text-left space-y-3 text-gray-700 mb-8">
                <li className="flex items-center gap-2">✅ Access to all benchmarks</li>
                <li className="flex items-center gap-2">✅ Full control over telemetry</li>
                <li className="flex items-center gap-2">✅ Full control over evaluation</li>
              </ul>
              <button className="w-full py-3 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Get Started</button>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-purple-500 shadow-lg relative">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">Most Popular</div>
              <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
              <p className="text-5xl font-bold mb-2">Custom</p>
              <p className="text-gray-500 mb-6">For large organizations with specific needs.</p>
              <ul className="text-left space-y-3 text-gray-700 mb-8">
                <li className="flex items-center gap-2">✅ Dedicated support</li>
                <li className="flex items-center gap-2">✅ Creation of tailored datasets</li>
                <li className="flex items-center gap-2">✅ All Basic features</li>
              </ul>
              <button className="w-full py-3 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}