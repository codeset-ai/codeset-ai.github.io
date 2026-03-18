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
          <p className="text-sm text-gray-500 mb-10">Last Updated: March 16, 2026</p>

          <p className="mb-8">
            These Terms of Service (&quot;Terms&quot;) govern the use of the services provided by Codeset, Lda, a company registered in Portugal, with registered address at Av. Mouzinho de Albuquerque 48 5B, 1170-265 Lisboa, Portugal, VAT number 518962938 (&quot;Codeset&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p className="mb-8">
            By accessing or using any Codeset service, including the Codeset Platform, you agree to be bound by these Terms.
          </p>
          <p className="mb-10">
            If you do not agree to these Terms, you must not use our services.
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">1. Company Information</h2>
            <p className="mb-2">Company Name: Codeset, Lda</p>
            <p className="mb-2">Address: Av. Mouzinho de Albuquerque 48 5B, 1170-265 Lisboa, Portugal</p>
            <p className="mb-4">VAT Number: 518962938</p>
            <p className="mb-2">For legal inquiries you may contact <a href="mailto:nuno@codeset.ai,andre@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai, andre@codeset.ai</a></p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2. Services Provided</h2>
            <p className="mb-4">
              Codeset provides software tools designed to improve the development and evaluation of AI agents that interact with software repositories.
            </p>
            <h3 className="text-lg font-medium mb-2">2.1 Codeset Platform</h3>
            <p className="mb-4">
              The Codeset Platform provides infrastructure for training and evaluating agentic models using large-scale datasets of reproducible, sandboxed environments. The intended users are businesses, researchers, and laboratories developing agentic models.
            </p>
            <h3 className="text-lg font-medium mb-2">2.2 Codeset</h3>
            <p className="mb-4">
              Codeset runs on user repositories and produces configuration and dataset files intended to improve the cost and accuracy of code agents interacting with those repositories. The intended users include developers and organizations using automated coding agents.
            </p>
            <p>
              Codeset reserves the right to modify, suspend, or discontinue any part of the services at any time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">3. Eligibility</h2>
            <p className="mb-2">To use Codeset services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 13 years old.</li>
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
            <p>Codeset reserves the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">5. Payments, Credits, and Subscriptions</h2>
            <p className="mb-4">Codeset uses Stripe as a payment processor.</p>
            <h3 className="text-lg font-medium mb-2">5.1 Credits</h3>
            <p className="mb-4">
              Users may purchase and deposit credits into their Codeset account, which are used to access services. Credits may be consumed through platform usage.
            </p>
            <h3 className="text-lg font-medium mb-2">5.2 Subscriptions</h3>
            <p className="mb-4">
              Codeset may offer subscription-based access to certain services or features. Subscriptions may be billed on a recurring basis (e.g., monthly or yearly) and will renew automatically unless canceled by the user before the next billing cycle. Users are responsible for managing and canceling their subscriptions through their account settings or payment provider.
            </p>
            <h3 className="text-lg font-medium mb-2">5.3 Refunds</h3>
            <p>
              Refunds may be issued only if the product provided does not match the description of the service. Codeset is not responsible for perceived underperformance of the service. Unused credits or subscription payments are otherwise non-refundable, unless required by applicable law.
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
            <p>Violation of these rules may result in immediate account suspension or termination.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">7. Repository Access and User Content</h2>
            <p className="mb-4">
              Users may provide Codeset access to their repositories for the purpose of running Codeset. By granting access, the user:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Confirms they have permission to provide such access</li>
              <li>Grants Codeset limited permission to read repository contents solely to execute the service</li>
            </ul>
            <p className="mb-2">Codeset:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Does not retain repository copies after runs</li>
              <li>Stores metadata and analysis generated about repositories</li>
              <li>Uses this generated information only to provide services to the user</li>
              <li>Does not disclose this information to third parties</li>
              <li>Implements reasonable technical and organisational security measures to protect stored information</li>
            </ul>
            <p className="mb-2">Users acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Repository-derived information may not be encrypted at rest by default</li>
              <li>No security measure is guaranteed to prevent all unauthorised access; Codeset&apos;s liability for security incidents is limited as set out in Section 13</li>
            </ul>
            <p>Organizations requiring enhanced security guarantees must establish separate written agreements with Codeset.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">8. Confidential Information</h2>
            <p className="mb-4">
              Each party agrees to keep confidential any non-public information disclosed by the other party in connection with these Terms, including but not limited to repository contents, source code, business data, authentication credentials, and technical or commercial information (&quot;Confidential Information&quot;). Each party agrees to: use Confidential Information only to fulfil its obligations under these Terms; not disclose Confidential Information to third parties without the disclosing party&apos;s prior written consent; and apply at least the same degree of care it uses to protect its own confidential information, but no less than reasonable care.
            </p>
            <p className="mb-4">
              These obligations do not apply to information that: is or becomes publicly available through no fault of the receiving party; was already known to the receiving party at the time of disclosure; is independently developed by the receiving party without use of the Confidential Information; or is required to be disclosed by law or court order, provided the receiving party gives prompt prior written notice where legally permitted.
            </p>
            <p>
              Confidentiality obligations survive termination of these Terms for a period of five years, except with respect to trade secrets, for which obligations continue for as long as the information remains a trade secret.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">9. Intellectual Property</h2>
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
            <h2 className="text-xl font-semibold mb-4">10. Privacy and Data Protection</h2>
            <p className="mb-4">
              Codeset processes personal data as data controller in accordance with applicable data protection law, including the General Data Protection Regulation (EU) 2016/679 (GDPR). Codeset implements appropriate technical and organisational measures to protect personal data against unauthorised access, loss, or disclosure.
            </p>
            <p className="mb-4">
              Users are responsible for ensuring that any personal data they submit or process through the services complies with applicable data protection laws, including obtaining any necessary consents from their end users.
            </p>
            <p>
              For full details of how Codeset collects, uses, stores, and protects personal data, and to understand your rights as a data subject, please refer to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">11. AI and Automated Systems Disclaimer</h2>
            <p className="mb-4">
              Codeset services involve automated systems and artificial intelligence tools. Users acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>AI-generated outputs may contain errors, inaccuracies, or incomplete information</li>
              <li>Generated outputs may occasionally produce unexpected or offensive content</li>
              <li>Results produced by the services should be reviewed before use in production environments</li>
            </ul>
            <p className="mb-4">
              Codeset does not guarantee accuracy, reliability, or suitability of AI-generated outputs. Users are responsible for evaluating and validating any outputs before relying on them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">12. Service Availability</h2>
            <p className="mb-4">
              Services are provided &quot;as is&quot; and &quot;as available.&quot; Codeset does not guarantee: continuous availability; error-free operation; absence of interruptions or outages. Codeset is not liable for damages resulting from downtime or service disruptions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">13. Limitation of Liability</h2>
            <p className="mb-4">
              IN NO EVENT WILL EITHER PARTY BE LIABLE UNDER OR IN CONNECTION WITH THIS AGREEMENT UNDER ANY LEGAL OR EQUITABLE THEORY, INCLUDING BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, AND OTHERWISE, FOR ANY: (A) CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, ENHANCED, OR PUNITIVE DAMAGES; (B) INCREASED COSTS, DIMINUTION IN VALUE OR LOST BUSINESS, PRODUCTION, REVENUES, OR PROFITS; (C) LOSS OF GOODWILL OR REPUTATION; (D) USE, INABILITY TO USE, LOSS, INTERRUPTION, DELAY OR RECOVERY OF ANY DATA, OR BREACH OF DATA OR SYSTEM SECURITY; OR (E) COST OF REPLACEMENT SOFTWARE OR SERVICES, IN EACH CASE REGARDLESS OF WHETHER EITHER PARTY WAS ADVISED OF THE POSSIBILITY OF SUCH LOSSES OR DAMAGES OR SUCH LOSSES OR DAMAGES WERE OTHERWISE FORESEEABLE. THE LIMITATIONS SET OUT IN THIS CLAUSE SHALL NOT APPLY TO PERSONAL INJURY, INCLUDING DEATH, CAUSED BY EACH PARTY&apos;S NEGLIGENCE.
            </p>
            <p>
              IN NO EVENT WILL CODESET&apos;S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED IN AGGREGATE THE FEES PAID BY THE USER IN THE PREVIOUS 12 MONTHS.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">14. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify, defend, and hold harmless Codeset and its officers, employees, and agents from and against any third-party claims, losses, damages, and expenses (including reasonable legal fees) arising from or relating to: your use of the services; your violation of these Terms; or your violation of any applicable law or third-party rights.
            </p>
            <p>
              Codeset will provide you with prompt written notice of any such claim and reasonably cooperate in your defense. Codeset reserves the right to assume exclusive control of its defense at its own expense.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">15. Termination</h2>
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
            <h2 className="text-xl font-semibold mb-4">16. Changes to the Terms</h2>
            <p className="mb-4">
              Codeset may update these Terms from time to time. If significant changes are made, users will be notified through the platform or by email with at least 30 days&apos; notice before the changes take effect. Continued use of the services after changes become effective constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">17. General Provisions</h2>
            <p className="mb-4">
              Entire Agreement. These Terms constitute the entire agreement between you and Codeset regarding the services and supersede all prior agreements or understandings on the same subject matter.
            </p>
            <p className="mb-4">
              Severability. If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
            <p className="mb-4">
              Non-Assignment. These Terms are personal to you. You may not assign or transfer your rights or obligations under these Terms without Codeset&apos;s prior written consent. Codeset may freely assign its rights and obligations.
            </p>
            <p>
              Force Majeure. Codeset shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including but not limited to natural disasters, acts of government, power failures, internet outages, or third-party service failures.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">18. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of Portugal. Any dispute arising from or relating to these Terms shall be submitted to the exclusive jurisdiction of the courts of Lisbon, Portugal, unless otherwise required by applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">19. Contact</h2>
            <p className="mb-2">For legal inquiries regarding these Terms:</p>
            <p className="mb-2">Email:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><a href="mailto:nuno@codeset.ai" className="text-blue-600 hover:underline">nuno@codeset.ai</a></li>
              <li><a href="mailto:andre@codeset.ai" className="text-blue-600 hover:underline">andre@codeset.ai</a></li>
            </ul>
            <p className="mb-2">Address:</p>
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
