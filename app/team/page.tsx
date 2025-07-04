import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Team() {
  const teamMembers = [
    {
      name: "André Silva",
      role: "Co-Founder and CEO",
      image: "/andre.jpeg",
      description: "Expert in machine learning on code, creator of RepairBench. Interned at Microsoft.",
      socials: [
        { url: "https://www.linkedin.com/in/andre15silva", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg> },
        { url: "https://x.com/andre15silva_", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg> },
        { url: "https://github.com/andre15silva", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
        { url: "https://scholar.google.com/citations?hl=en&user=PZoplKIAAAAJ", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/><path d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-1 3h2v6h-2v-6zm0-2h2v2h-2v-2z"/></svg> },
      ],
    },
    {
      name: "Nuno Saavedra",
      role: "Co-Founder and CTO",
      image: "/nuno.png",
      description: "Expert in software reliability, data mining, and IaC. Published at all top 3 SWE conferences.",
      socials: [
        { url: "https://www.linkedin.com/in/nuno-saavedra", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg> },
        { url: "https://x.com/nunofsaavedra", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg> },
        { url: "https://github.com/nfsaavedra", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
        { url: "https://scholar.google.com/citations?hl=en&user=iYiwTYUAAAAJ", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/><path d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-1 3h2v6h-2v-6zm0-2h2v2h-2v-2z"/></svg> },
      ],
    },
    {
      name: "João F. Ferreira",
      role: "Scientific Advisor",
      image: "/joao.jpg",
      description: "Computer ScienceProfessor. Focused on automated reasoning and software reliability.",
      socials: [
        { url: "https://linkedin.com/in/joaoff", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg> },
        { url: "https://x.com/jff", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg> },
        { url: "https://github.com/jff", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
        { url: "https://scholar.google.com/citations?hl=en&user=WurhenEAAAAJ", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/><path d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-1 3h2v6h-2v-6zm0-2h2v2h-2v-2z"/></svg> },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="w-full mx-auto px-8 flex flex-col items-center gap-12">
          {/* Hero Section: Meet Our Team */}
          <div className="md:w-full text-center pt-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4">
              Meet Our Team
            </h1>
            <h2 className="text-lg text-gray-600 mb-8">
              We are dedicated to building the future of AI code agents.
            </h2>
          </div>

          {/* Team Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-1">{member.name}</h2>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{member.description}</p>
                <div className="flex justify-center space-x-5 mt-auto">
                  {member.socials.map((social, socialIndex) => (
                    <a key={socialIndex} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Us Section */}
          <div className="w-full max-w-4xl text-center py-16">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              Have Questions? Get in Touch!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to hear from you. Feel free to reach out to us directly.
            </p>
            <a href="mailto:andre@codeset.ai,nuno@codeset.ai" className="px-6 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
