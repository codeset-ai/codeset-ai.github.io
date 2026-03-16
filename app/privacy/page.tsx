import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Codeset",
  description: "Privacy Policy for Codeset platform and agent services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />
      <main className="flex-1 flex flex-col pt-20 pb-16">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last Updated: March 16, 2026</p>

          <p className="mb-8">
            This Privacy Policy describes how Codeset, Lda (&quot;Codeset&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), registered at Av. Mouzinho de Albuquerque 48 5B, 1170-265 Lisboa, Portugal (VAT 518962938), collects, uses, and protects personal data in connection with our services.
          </p>
          <p className="mb-10">
            We process personal data in accordance with Regulation (EU) 2016/679 (GDPR). By using our services, you acknowledge this policy.
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">1. Personal Data We Collect</h2>

            <h3 className="text-lg font-medium mb-2">1.1 Account Registration</h3>
            <p className="mb-4">
              When you register, we collect your name and email address via GitHub OAuth. We do not store GitHub passwords or access tokens beyond what is necessary to authenticate your session.
            </p>

            <h3 className="text-lg font-medium mb-2">1.2 Billing and Subscriptions</h3>
            <p className="mb-4">
              When you purchase credits or a subscription, our payment processor Stripe collects and processes your billing information (name, company, email address, billing address, and VAT number where applicable). Codeset does not store payment card details.
            </p>

            <h3 className="text-lg font-medium mb-2">1.3 Repository Data</h3>
            <p className="mb-4">
              When you use the Codeset Agent, we temporarily access the contents of repositories you authorise via GitHub. We do not retain repository copies after a run completes. We store metadata and analysis derived from repositories solely to provide the service to you. See our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> for full details.
            </p>

            <h3 className="text-lg font-medium mb-2">1.4 Usage Data and Analytics</h3>
            <p className="mb-4">
              We use Google Analytics to collect anonymised information about how users interact with our website and platform, including pages visited, session duration, and general location. Google Analytics uses cookies to collect this information. You can opt out of Google Analytics tracking by using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h3 className="text-lg font-medium mb-2">1.5 Marketing Communications</h3>
            <p className="mb-4">
              If you provide your email address to receive marketing communications, we store that address and use it to send you updates about Codeset products and services. You may unsubscribe at any time by following the unsubscribe link in any email or by contacting us directly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2. How We Use Personal Data</h2>
            <p className="mb-2">We use the personal data we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Create and manage your account</li>
              <li>Provide, maintain, and improve our services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send service-related administrative communications</li>
              <li>Send marketing communications where you have opted in</li>
              <li>Monitor and protect against fraud and security threats</li>
              <li>Analyse usage patterns to improve the platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">3. Legal Bases for Processing</h2>
            <p className="mb-2">We process personal data under the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Performance of a contract (Art. 6(1)(b) GDPR): processing necessary to provide the services you have requested</li>
              <li>Legitimate interests (Art. 6(1)(f) GDPR): usage analytics, security monitoring, and service improvement</li>
              <li>Consent (Art. 6(1)(a) GDPR): marketing communications, where you have explicitly opted in</li>
              <li>Legal obligation (Art. 6(1)(c) GDPR): compliance with applicable law</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Subprocessors</h2>
            <p className="mb-4">
              We do not sell, rent, or trade your personal data. We share data only with the following third parties where necessary to provide the services:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>GitHub (authentication and repository access)</li>
              <li>Stripe (payment processing)</li>
              <li>Google Analytics (usage analytics)</li>
              <li>Microsoft Azure (cloud infrastructure and data storage)</li>
            </ul>
            <p>
              We may also disclose personal data to law enforcement or regulatory authorities when required by applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">5. Data Storage and Transfers</h2>
            <p className="mb-4">
              All user data is stored on Microsoft Azure infrastructure located in Europe. Where data is transferred outside the European Economic Area (for example, through Google Analytics), such transfers are conducted in accordance with GDPR, using adequacy decisions or Standard Contractual Clauses as appropriate.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain personal data only for as long as necessary to provide the services and fulfil the purposes described in this policy. When determining retention periods, we consider the nature of the data, our contractual obligations, legitimate business interests, and applicable legal requirements.
            </p>
            <p>
              When you delete your account, we will delete or anonymise your personal data within a reasonable period, except where retention is required by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">7. Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">8. Children</h2>
            <p className="mb-4">
              Our services are not directed to children under the age of 13. We do not knowingly collect personal data from children under 13. If you become aware that a child under 13 has provided us with personal data, please contact us and we will take steps to delete such information. Users in the EU/EEA must meet the applicable age of digital consent for their jurisdiction, or provide verifiable parental authorisation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">9. Your Rights</h2>
            <p className="mb-2">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Rectify inaccurate or incomplete personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Restrict or object to processing</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
              <li>Lodge a complaint with the Portuguese data protection authority (CNPD, <a href="https://www.cnpd.pt" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">cnpd.pt</a>)</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:nuno@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai</a> or <a href="mailto:andre@codeset.ai" className="text-blue-600 hover:underline">andre@codeset.ai</a>. We will respond within 30 days, or within two months for requests of special complexity.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the platform or by email. Continued use of the services after changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
            <p className="mb-2">For any privacy-related questions or to exercise your rights:</p>
            <p className="mb-2">Email:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><a href="mailto:nuno@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai</a></li>
              <li><a href="mailto:andre@codeset.ai" className="text-blue-600 hover:underline">andre@codeset.ai</a></li>
            </ul>
            <p className="mb-2">Address:</p>
            <p>Av. Mouzinho de Albuquerque 48 5B<br />1170-265 Lisboa<br />Portugal</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
