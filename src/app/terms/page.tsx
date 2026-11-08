import React from 'react';
import Link from 'next/link';
import { FileText, Scale, ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | StudioSpace',
  description: 'Operating guidelines, booking rules, and contractual terms governing StudioSpace creators and studio hosts.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-500 transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to StudioSpace</span>
          </Link>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-500 uppercase tracking-widest mb-2">
            <Scale className="size-4" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Last Updated: November 2026. Standard governing agreement between creators, hosts, and StudioSpace Inc.
          </p>
        </div>

        <div className="space-y-10 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">1.</span> Agreement and Acceptance
            </h2>
            <p>
              By accessing, browsing, registering an account, listing a production property, or reserving a studio space
              through StudioSpace, you agree to be bound by these Terms of Service. If you are entering into this agreement
              on behalf of a production company, studio agency, or creative enterprise, you represent that you possess the
              authority to bind that entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">2.</span> Host Obligations and Listing Veracity
            </h2>
            <p>Hosts publishing spaces on StudioSpace warrant and agree that:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                All stated spatial dimensions, acoustic dampening ratings, electrical panel amperages, ceiling heights,
                and included lighting or sound gear reflect verified real-world conditions.
              </li>
              <li>
                Properties comply with municipal building codes, commercial zoning ordinances, fire safety standards,
                and valid commercial insurance policies.
              </li>
              <li>
                Space availability schedules displayed on the platform are kept current to prevent double bookings.
              </li>
              <li>
                Hosts maintain the right to accept or decline incoming reservation requests within 24 hours of submission.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">3.</span> Booking, Billing, and Security Deposits
            </h2>
            <p>
              Hourly rates are calculated based on scheduled call time to final wrap time. Total booking totals include
              the base hourly fee, applicable cleaning charges, and a standardized 10% refundable security deposit hold.
            </p>
            <p>
              Security deposit holds are authorized upon booking confirmation and automatically released 24 hours post-wrap,
              provided no unresolved damage claims or severe overtime violations are submitted by the host with photographic
              documentation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">4.</span> Cancellation Policies
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Standard Grace Period:</strong> Full refund for
                cancellations initiated at least 48 hours prior to scheduled call time.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Late Cancellations:</strong> Cancellations initiated
                between 24 to 48 hours prior to call time receive a 50% refund minus payment processing fees.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Under 24 Hours:</strong> Bookings cancelled under
                24 hours from call time are non-refundable to protect host preparations.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">5.</span> Creator Conduct and On-Set Rules
            </h2>
            <p>
              Creators and production crews must respect posted host rules, maximum headcount limits, and certified noise
              ordinances. Hazardous effects such as open flames, uncontained water tanks, heavy pyrotechnics, and unshielded
              high-draw electrical taps are strictly prohibited without prior written consent and appropriate fire marshal permits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">6.</span> Limitation of Liability
            </h2>
            <p>
              StudioSpace provides a digital discovery and scheduling marketplace. While StudioSpace verifies host identities
              and listing profiles, StudioSpace is not an insurer, property manager, or direct employer of production crew.
              Parties are strongly advised to carry third-party general liability and production insurance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">7.</span> Contact and Dispute Resolution
            </h2>
            <p>
              Disputes between creators and hosts regarding deposits or equipment damage are mediated by our Trust and
              Safety team within 5 business days:
            </p>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs flex items-center gap-3">
              <Mail className="size-4 text-amber-500 shrink-0" />
              <span>legal@studiospace.io &bull; StudioSpace Legal Operations</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

