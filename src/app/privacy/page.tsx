import React from 'react';
import Link from 'next/link';
import { Shield, Lock, FileText, ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | StudioSpace',
  description: 'Learn how StudioSpace collects, uses, and safeguards creator and studio host information.',
};

export default function PrivacyPolicyPage() {
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
            <Lock className="size-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Last Updated: November 2026. Effective for all registered creators, hosts, and visitors.
          </p>
        </div>

        <div className="space-y-10 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">1.</span> Overview and Scope
            </h2>
            <p>
              StudioSpace operates a peer-to-peer workspace sharing marketplace connecting visual creators, filmmakers,
              photographers, sound engineers, and creative producers with vetted production spaces. This Privacy Policy
              explains how StudioSpace collects, processes, stores, and protects personal and production data across
              all web applications, mobile platforms, and API endpoints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">2.</span> Information We Collect
            </h2>
            <p>We collect information required to operate a trusted creative marketplace:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Account Credentials:</strong> Full name, verified
                email address, profile avatar, and authentication identifiers through direct credentials or Google Identity Services.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Production Booking Data:</strong> Session dates,
                scheduled call times, crew headcount, project genre, equipment requests, invoice records, and specialized access requests.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Host Listing Specifications:</strong> Property
                addresses, spatial dimensions, acoustic ratings, electrical capacity, stage amenities, high-resolution media, and payout details.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">Technical Device Data:</strong> IP addresses, browser
                fingerprints, session timestamps, and diagnostic telemetry for system integrity and fraud prevention.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">3.</span> How We Utilize Information
            </h2>
            <p>Collected data is used strictly for legitimate marketplace operations:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Processing studio reservations, time slot availability locks, and host approvals.</li>
              <li>Issuing automated production invoices, digital booking passes, and security deposit releases.</li>
              <li>Facilitating on-site access control and biometric or contactless keycard provisioning.</li>
              <li>Detecting fraudulent listings, unauthorized chargebacks, and security vulnerabilities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">4.</span> Data Protection and Third Parties
            </h2>
            <p>
              StudioSpace does not sell, trade, or rent personal information to data brokers or advertising networks.
              Data is shared exclusively with infrastructure providers essential to service delivery, including cloud database
              hosts, geocoding engines (OpenStreetMap Nominatim), and encrypted payment tokenization gateways.
            </p>
            <p>
              All transit communications enforce TLS 1.3 encryption. Encrypted tokens and credentials are held under
              industry-standard cryptographic protocols with restricted operational access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">5.</span> Creator Rights and Data Retention
            </h2>
            <p>
              Registered users maintain full control over their personal records. You may review, modify, or permanently
              purge your profile, listing portfolio, and past booking logs by contacting our compliance registry.
              Financial transaction records are archived solely for mandatory regulatory and tax compliance periods.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-amber-500">6.</span> Compliance and Legal Inquiries
            </h2>
            <p>
              For privacy requests, data export processing, or inquiries regarding our information practices, contact our
              designated compliance desk:
            </p>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs flex items-center gap-3">
              <Mail className="size-4 text-amber-500 shrink-0" />
              <span>privacy@studiospace.io &bull; StudioSpace Legal Operations</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

