import Header from "@/components/Header";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-mono">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
