import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Codeset",
  description: "Terms of Service for Codeset platform and agent services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />
      <main className="flex-1 flex flex-col pt-20 pb-16">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">Last Updated: March 13, 2026</p>

          <p className="mb-8">
            These Terms of Service (&quot;Terms&quot;) govern the use of the services provided by <strong>Codeset, Lda</strong>, a company registered in Portugal, with registered address at <strong>Av. Mouzinho de Albuquerque 48 5B, 1170-265 Lisboa, Portugal</strong>, VAT number <strong>518962938</strong> (&quot;Codeset&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p className="mb-8">
            By accessing or using any Codeset service, including the <strong>Codeset Platform</strong> and <strong>Codeset Agent</strong>, you agree to be bound by these Terms.
          </p>
          <p className="mb-10">
            If you do not agree to these Terms, you must not use our services.
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">1. Company Information</h2>
            <p className="mb-2"><strong>Company Name:</strong> Codeset, Lda</p>
            <p className="mb-2"><strong>Address:</strong> Av. Mouzinho de Albuquerque 48 5B, 1170-265 Lisboa, Portugal</p>
            <p className="mb-4"><strong>VAT Number:</strong> 518962938</p>
            <p className="mb-2">For legal inquiries you may contact <a href="mailto:nuno@codeset.ai,andre@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai, andre@codeset.ai</a></p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2. Services Provided</h2>
            <p className="mb-4">
              Codeset provides software tools designed to improve the development and evaluation of AI agents that interact with software repositories.
            </p>
            <h3 className="text-lg font-medium mb-2">2.1 Codeset Platform</h3>
            <p className="mb-4">
              The <strong>Codeset Platform</strong> provides infrastructure for training and evaluating agentic models using large-scale datasets of reproducible, sandboxed environments. The intended users are businesses, researchers, and laboratories developing agentic models.
            </p>
            <h3 className="text-lg font-medium mb-2">2.2 Codeset Agent</h3>
            <p className="mb-4">
              The <strong>Codeset Agent</strong> runs on user repositories and produces configuration and dataset files intended to improve the cost and accuracy of code agents interacting with those repositories. The intended users include developers and organizations using automated coding agents.
            </p>
            <p>
              Codeset reserves the right to modify, suspend, or discontinue any part of the services at any time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">3. Eligibility</h2>
            <p className="mb-2">To use Codeset services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be <strong>at least 18 years old</strong>.</li>
              <li>If you are using the services on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">4. User Accounts</h2>
            <p className="mb-4">Use of the services requires creating an account.</p>
            <p className="mb-2">Users agree to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Provide accurate registration information.</li>
              <li>Maintain the confidentiality of their login credentials.</li>
              <li>Accept responsibility for all activities that occur under their account.</li>
            </ul>
            <p>Codeset reserves the right to <strong>suspend or terminate accounts</strong> that violate these Terms.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">5. Payments, Credits, and Subscriptions</h2>
            <p className="mb-4">Codeset uses <strong>Stripe</strong> as a payment processor.</p>
            <h3 className="text-lg font-medium mb-2">5.1 Credits</h3>
            <p className="mb-4">
              Users may purchase and deposit <strong>credits</strong> into their Codeset account, which are used to access services. Credits may be consumed through platform usage.
            </p>
            <h3 className="text-lg font-medium mb-2">5.2 Subscriptions</h3>
            <p className="mb-4">
              Codeset may offer <strong>subscription-based access</strong> to certain services or features. Subscriptions may be billed on a <strong>recurring basis (e.g., monthly or yearly)</strong> and will renew automatically unless canceled by the user before the next billing cycle. Users are responsible for managing and canceling their subscriptions through their account settings or payment provider.
            </p>
            <h3 className="text-lg font-medium mb-2">5.3 Refunds</h3>
            <p>
              Refunds may be issued <strong>only if the product provided does not match the description of the service</strong>. Codeset is <strong>not responsible for perceived underperformance</strong> of the service. Unused credits or subscription payments are otherwise <strong>non-refundable</strong>, unless required by applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">6. Acceptable Use</h2>
            <p className="mb-2">Users must not use the services to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Engage in illegal activity</li>
              <li>Harass or abuse others</li>
              <li>Reverse engineer the software</li>
              <li>Scrape or extract data from the platform</li>
              <li>Overload, disrupt, or damage the infrastructure</li>
              <li>Upload or use copyrighted material they do not own or have permission to use</li>
            </ul>
            <p>Violation of these rules may result in <strong>immediate account suspension or termination</strong>.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">7. Repository Access and User Content</h2>
            <p className="mb-4">
              Users may provide Codeset access to their repositories for the purpose of running the <strong>Codeset Agent</strong>. By granting access, the user:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Confirms they have permission to provide such access</li>
              <li>Grants Codeset <strong>limited permission to read repository contents solely to execute the service</strong></li>
            </ul>
            <p className="mb-2">Codeset:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong>Does not retain repository copies after runs</strong></li>
              <li><strong>Stores metadata and analysis generated about repositories</strong></li>
              <li>Uses this generated information <strong>only to provide services to the user</strong></li>
              <li>Does <strong>not disclose this information to third parties</strong></li>
            </ul>
            <p className="mb-2">Users acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Repository-derived information may not be encrypted</li>
              <li>Codeset is <strong>not responsible for potential leaks or unauthorized access to such information</strong></li>
            </ul>
            <p>Organizations requiring enhanced security guarantees must establish <strong>separate written agreements with Codeset</strong>.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-2">Codeset retains all rights to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Its software</li>
              <li>Platform infrastructure</li>
              <li>Branding</li>
              <li>Website content</li>
            </ul>
            <p className="mb-2">Users retain ownership of:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Their repositories</li>
              <li>Their data</li>
              <li>Files generated for their use</li>
            </ul>
            <p>Nothing in these Terms transfers ownership of user data to Codeset.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">9. AI and Automated Systems Disclaimer</h2>
            <p className="mb-4">
              Codeset services involve <strong>automated systems and artificial intelligence tools</strong>. Users acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>AI-generated outputs may contain <strong>errors, inaccuracies, or incomplete information</strong></li>
              <li>Generated outputs may occasionally produce <strong>unexpected or offensive content</strong></li>
              <li>Results produced by the services should be <strong>reviewed before use in production environments</strong></li>
            </ul>
            <p className="mb-4">
              Codeset does <strong>not guarantee accuracy, reliability, or suitability of AI-generated outputs</strong>. Users are responsible for evaluating and validating any outputs before relying on them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">10. Service Availability</h2>
            <p className="mb-4">
              Services are provided <strong>&quot;as is&quot; and &quot;as available.&quot;</strong> Codeset does not guarantee: continuous availability; error-free operation; absence of interruptions or outages. Codeset is not liable for damages resulting from downtime or service disruptions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Codeset shall <strong>not be liable for</strong>: user-generated content; AI-generated outputs; loss of data; loss of profits; indirect or consequential damages; system outages or infrastructure failures.
            </p>
            <p>
              Codeset&apos;s total liability for any claim related to the services shall not exceed the <strong>amount paid by the user for the services in the previous 12 months</strong>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">12. Termination</h2>
            <p className="mb-4">
              Codeset may suspend or terminate accounts that: violate these Terms; engage in abusive or harmful activity; attempt to interfere with the platform. Users may stop using the services at any time.
            </p>
            <p className="mb-2">Upon termination:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access to the platform may be revoked</li>
              <li>Remaining credits may be forfeited unless otherwise required by law</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">13. Changes to the Terms</h2>
            <p className="mb-4">
              Codeset may update these Terms from time to time. If significant changes are made, users will be notified through the platform or by email. Continued use of the services after changes become effective constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">14. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the <strong>laws of Portugal</strong>. Any dispute arising from or relating to these Terms shall be submitted to the <strong>exclusive jurisdiction of the courts of Lisbon, Portugal</strong>, unless otherwise required by applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">15. Contact</h2>
            <p className="mb-2">For legal inquiries regarding these Terms:</p>
            <p className="mb-2"><strong>Email:</strong></p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><a href="mailto:nuno@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai</a></li>
              <li><a href="mailto:andre@codeset.ai" className="text-blue-600 hover:underline">andre@codeset.ai</a></li>
            </ul>
            <p className="mb-2"><strong>Address:</strong></p>
            <p>Av. Mouzinho de Albuquerque 48 5B<br />1170-265 Lisboa<br />Portugal</p>
          </section>

          <p className="text-gray-600 border-t pt-8 mt-8">
            By using the Codeset services, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
