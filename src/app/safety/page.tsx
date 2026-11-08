import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Flame, Wind, Lock, AlertTriangle, ArrowLeft, CheckCircle2, PhoneCall } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety Standards | StudioSpace',
  description: 'Certified production safety protocols, electrical guidelines, and property standards across StudioSpace facilities.',
};

export default function SafetyStandardsPage() {
  const safetyChecklist = [
    'Clear, unobstructed 36-inch pathways to all emergency fire exits and breaker panels.',
    'All overhead lighting fixtures and modifiers double-secured with rated safety cables.',
    'Heavy C-stands, boom arms, and rolling combo stands counter-weighted with sandbags.',
    'Electrical runs crossing high-traffic corridors protected by industrial yellow jacket cable ramps.',
    'Approved water or mineral oil-based hazers only, with prior ventilation isolation notification.',
    'Certified fire extinguishers (Class ABC) inspected, tagged, and accessible within 25 feet of set.',
  ];

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
            <ShieldCheck className="size-4" />
            <span>Production Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Safety Standards
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Standard operating protocols for electrical safety, structural rigging, and on-set incident mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
            <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="size-4.5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Electrical & Power Safety</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stages provide designated sub-panels with rated breakers. Total fixture draw must not exceed 80% continuous
              circuit rating. Cam-Lok and distro boxes must be handled by qualified gaffers or electrical technicians.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
            <div className="size-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Flame className="size-4.5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Fire Prevention & Atmospheric Egress</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Open flames, flash paper, and flammable pyrotechnics are strictly prohibited without written host permission
              and municipal permits. Hazers require verification that facility optical smoke detectors are appropriately bypassed.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Wind className="size-4.5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Overhead Grid & Truss Rigging</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pipe grid capacities are certified per linear foot. Never exceed listed payload ratings. Every rigged instrument,
              diffusion frame, or motorized fixture requires an independent secondary steel safety chain anchored to structural steel.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2">
            <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Lock className="size-4.5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Secure Access & Headcount Control</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Studio spaces operate verified contactless access codes or biometric verification locks. Unauthorized entry into
              adjacent stages or private host storage bays is strictly prohibited and constitutes an immediate lease forfeiture.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            <span>Mandatory Pre-Shoot Safety Checklist</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Before rolling camera or powering up high-draw lighting fixtures, production coordinators and gaffers must complete:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700 dark:text-zinc-300">
            {safetyChecklist.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Emergency Response & Incident Support
          </h2>
          <p>
            In the event of an electrical failure, structural concern, or physical emergency during an active booking,
            hosts provide 24/7 on-call facility liaisons. For life safety emergencies, immediately contact local emergency
            services (911) before alerting platform staff.
          </p>
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs flex items-center gap-3">
            <PhoneCall className="size-4 text-amber-500 shrink-0" />
            <span>Emergency Operations Dispatch: safety@studiospace.io &bull; Priority Line: 1-800-STUDIO-SAFE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

