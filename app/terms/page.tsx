// app/terms/page.tsx
import React from "react";
import { FaRegCopyright } from "react-icons/fa";
export default function TermsPage() {
  return (
    <main
      id="top"
      className="min-h-screen bg-gray-50 px-4 py-12 md:px-8 scroll-smooth"
    >
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-sm p-6 md:p-10">

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#C9A227]">
            Metalhive — Policies & Agreements
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            
          </p>

          {/* Section Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="#buyer"
              className="px-4 py-2 rounded-xl bg-[#C9A227] text-white font-medium hover:bg-yellow-400 transition"
            >
              Buyer Due Diligence Checklist
            </a>
            <a
              href="#seller"
              className="px-4 py-2 rounded-xl bg-[#C9A227] text-white font-medium hover:bg-yellow-400 transition"
            >
              Seller Compliance Agreement
            </a>
            <a
              href="#user"
              className="px-4 py-2 rounded-xl bg-[#C9A227] text-white font-medium hover:bg-yellow-400 transition"
            >
              User Agreement
            </a>
          </div>
        </header>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-[#17181A] mb-6">
            Privacy Policy
          </h2>

          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
{`METALHIVE PRIVACY POLICY


This Privacy Policy explains how Metalhive (“we,” “our,” “the Platform”) collects, uses, stores, and protects personal information from users (“you,” “Buyers,” “Sellers”).

1. Information We Collect
  1.1 Personal Information: Name, Email, Phone, Business details, Government ID (if required)
  1.2 Transactional Information: Listings, photos, messages, payment info (processed via third parties)
  1.3 Technical Information: IP, device, browser, cookies, usage stats

2. How We Use Your Information
  - Create and manage accounts; verify seller legitimacy; facilitate communications; improve platform; enforce Terms; comply with law.
  - We do not sell personal information to third parties.

3. Sharing Your Information
  - With law enforcement when required; payment processors; third-party service providers that support operations.
  - No marketing data sharing without consent.

4. Security of Your Information
  - Industry-standard measures. Users must safeguard login credentials.

5. Cookies
  - Used for UX, analytics, session preferences. Can be disabled via browser.

6. Data Retention
  - Retained as necessary for legal compliance, security, fraud prevention, and operations. Users may request deletion subject to legal requirements.

7. Your Rights
  - Access, correction, deletion, withdraw consent, file complaints (region-dependent).

8. Changes to This Policy
  - We may update periodically; continued use implies acceptance.`}
          </div>
        </section>

        {/* User Agreement */}
        <section id="user" className="mb-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-[#17181A] mb-6">
            User Agreement
          </h2>

          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
{`METALHIVE USER AGREEMENT


This User Agreement governs your use of Metalhive. By using the platform, you agree to the following terms.

1. Eligibility
  - 18+ years old; legally able to transact; provide accurate information.

2. User Responsibilities
  - Provide truthful registration details; use platform lawfully; upload only legitimate scrap materials; respect privacy; avoid fraud.

3. Platform Role
  - Metalhive does not own items, guarantee accuracy, act as broker/warehouse, or mediate financial disputes. Transactions are between users.

4. User Conduct
  - No stolen/illegal materials; no harassment, scamming, fake accounts, or circumvention of rules.

5. Limitation of Liability
  - Metalhive not responsible for user misconduct, fraudulent listings, disputes, financial losses, or legality/quality of materials. Users act at their own risk.

6. Suspension & Termination
  - Accounts may be suspended or terminated for illegal or repeated violations.`}
          </div>
        </section>

        {/* Seller Compliance */}
        <section id="seller" className="mb-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-[#17181A] mb-6">
            Seller Compliance Agreement
          </h2>

          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
{`METALHIVE SELLER COMPLIANCE AGREEMENT


This Agreement outlines seller obligations on Metalhive.

1. Verification of Ownership
  - Sellers certify legal ownership; items are not stolen or illegally sourced; documentation available on request.

2. Accurate Representation
  - True info on weight, grade, condition; clear photos and descriptions; proof of origin when requested.

3. Documentation Requirements
  - Sellers may be required to provide proof of purchase, permits, recycling documentation, government ID.

4. Legal Responsibility
  - Sellers assume full legal responsibility for listed items. Metalhive not liable for stolen items; will cooperate with authorities.

5. Prohibited Listings
  - No stolen materials, hazardous waste without certification, misrepresented metals, or items not owned by seller.

6. Consequences of Non-Compliance
  - Listings removed; accounts suspended/terminated; payments blocked; reports to law enforcement.`}
          </div>
        </section>

        {/* Buyer Checklist */}
        <section id="buyer" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-[#17181A] mb-6">
            Buyer Due Diligence Checklist
          </h2>

          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
{`BUYER DUE DILIGENCE CHECKLIST
For Buyers on Metalhive

Before making payment, verify all information:

1. Verify Seller Identity
  - Check profile, rating, business registration; request ID if needed.

2. Confirm Legitimacy of Materials
  - Request proof of ownership, receipts/invoices, photos, recycling certificates.

3. Inspect Materials
  - Visit location if possible; verify weight, grade, condition; match with photos and descriptions.

4. Cross-check Documents
  - Ensure documents match seller details and are unaltered; confirm serial numbers where applicable.

5. Confirm Transaction Terms
  - Final price, delivery/pick-up, payment method, return/dispute terms.

6. Watch Out for Red Flags
  - Refusal to provide documents, rushed payment requests, suspiciously low prices, unclear source.

7. Final Confirmation
  - Buyers are fully responsible for verification BEFORE payment. Metalhive does not guarantee authenticity or legality.`}
          </div>
        </section>

        {/* Final Back to Top */}
        <div className="mt-16 text-center">
          <a
            href="#top"
            className="inline-block text-sm font-medium text-[#C9A227] hover:underline"
          >
            ↑ Back to top
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-6 border-t pt-6 text-center text-sm text-gray-500">
          Metalhive — connecting scrap sellers and buyers responsibly. <FaRegCopyright size={23} /> 2026
        </footer>
      </div>
    </main>
  );
}
