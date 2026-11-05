# StudioSpace - Creative Workspace & Production Studio Sharing Platform

> **Live Client Application:** [https://studiospacelive.netlify.app](https://studiospacelive.netlify.app)  
> **Live API Backend:** [https://studiospace-server-c4j2.onrender.com/api](https://studiospace-server-c4j2.onrender.com/api)  
> **Examiner Test Credentials:** `examiner@studiospace.io` / `Test1234`  
> **Client Repository:** [https://github.com/choyon-dev/studiospace-client](https://github.com/choyon-dev/studiospace-client)  
> **Server Repository:** [https://github.com/choyon-dev/studiospace-server](https://github.com/choyon-dev/studiospace-server)

![StudioSpace Platform Preview](./public/heroscreenshot.png)

---

## Executive Overview

StudioSpace is a peer-to-peer production marketplace connecting commercial film crews, photographers, audio engineers, and podcasters with verified creative studio spaces. The platform provides real-time calendar availability, instant collision-safe booking reservation pipelines, dynamic filtering, client-side PDF invoice generation, and dual-mode authentication.

---

## Core Engineering & Feature Highlights

### 1. App Router Performance & Next.js Optimization
- **Image Pipeline:** Server-side negotiation of modern AVIF and WebP formats via Next.js image optimization (`next/image`), 24-hour edge cache retention (`minimumCacheTTL: 86400`), responsive viewport `sizes`, and eager LCP preloading for above-the-fold hero slides.
- **Instant Streaming Fallbacks:** React Suspense streaming loading skeletons (`app/loading.tsx` and `app/studios/loading.tsx`) that match card geometry to eliminate cumulative layout shift (CLS = 0).
- **Navigation Prefetching:** High-intent conversion links (`/studios`, `/add-studio`, `/login`, `/register`) utilize `prefetch={true}` for instant route transitions.
- **Third-Party Script Strategy:** Google Identity Services (GIS) loads asynchronously off the critical path using Next.js `next/script` with `strategy="lazyOnload"`.
- **Bundle Tree-Shaking:** Configured `optimizePackageImports` for `lucide-react`, `sonner`, and `swiper` in `next.config.ts`.
- **Automated SEO Engine:** Automated dynamic XML sitemap generation (`app/sitemap.ts`) for static pages and individual studio detail routes, paired with crawler access policies in `app/robots.ts` and OpenGraph metadata.

### 2. Double-Booking Collision Prevention (Assignment Challenge 2)
- High-precision date and time-slot overlap detection running before booking persistence in MongoDB Atlas.
- Prevents conflicting reservations on the same date within overlapping hours, providing real-time availability block indicators on studio detail views.

### 3. Dual Authentication & Security (Assignment Challenge 1)
- **JWT over HTTPOnly Cookies:** User sessions use cryptographic JWT tokens stored inside secure, cross-origin `httpOnly` cookies (`sameSite: 'none'`, `secure: true`), protecting authenticated mutations (`/api/studios`, `/api/bookings`, `/api/wishlist`).
- **Google OAuth Integration:** Integrated Google Identity Services One-Tap and popup authentication for 1-click test onboarding.
- **Examiner Auto Fill:** 1-click test credential population on the login interface for quick evaluation.

### 4. Interactive Marketplace & Filtering
- **Dynamic Search & Multi-Criteria Filtering:** Filter studios by category, hub city, hourly price brackets, and sorting parameters (price low-high, high-low, rating, newest).
- **Wishlist & Dedicated Saved Spaces:** Persistent studio favoriting backed by backend user profiles with dedicated management at `/saved-studios`.
- **Branded PDF Invoice Receipts:** Downloadable official booking invoices rendered in-browser using `jsPDF` for confirmed reservations.
- **Dark/Light Theme Customization (Assignment Challenge 3):** System and toggleable dark/light themes powered by `next-themes` and Tailwind CSS with zero hydration mismatch.

---

## Tech Stack

| Domain | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Typography** | Syne (Display), Plus Jakarta Sans (Interface) |
| **Animation & Carousels** | Swiper 14, Hardware-accelerated CSS Keyframes |
| **Notifications** | Sonner Toasts |
| **Theme System** | Next-Themes (Class strategy, suppressHydrationWarning) |
| **Document Export** | jsPDF Client Receipt Generator |
| **Deployment** | Netlify Edge with continuous deployment from GitHub main |

---

## Directory Architecture

```
client/
├── public/
│   ├── heroscreenshot.png                  # Platform preview screenshot
│   ├── Isometric Photography Studio Diorama.png  # 3D host monetization asset
│   ├── favicon.ico                         # Platform favicon
│   └── icon.svg                            # Vector aperture mark
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout, fonts, metadata, Google Script
│   │   ├── loading.tsx                     # Global instant streaming loading skeleton
│   │   ├── page.tsx                        # Homepage
│   │   ├── robots.ts                       # Automated robots.txt crawler rules
│   │   ├── sitemap.ts                      # Automated sitemap.xml generator
│   │   ├── add-studio/page.tsx             # Studio listing creation form
│   │   ├── dashboard/page.tsx              # Host & renter unified control center
│   │   ├── login/page.tsx                  # Login with email and Google OAuth
│   │   ├── register/page.tsx               # Account registration
│   │   ├── my-bookings/page.tsx            # Confirmed reservations and PDF download
│   │   ├── my-listings/page.tsx            # Host inventory management
│   │   ├── saved-studios/page.tsx          # Dedicated wishlist management
│   │   ├── studios/
│   │   │   ├── page.tsx                    # Marketplace catalog with sidebar filters
│   │   │   ├── loading.tsx                 # Catalog-specific skeleton layout
│   │   │   └── [id]/page.tsx               # Studio detail view, calendar, booking modal
│   ├── components/
│   │   ├── Navbar.tsx                      # Sticky navigation, search dialog, spinning logo
│   │   ├── Footer.tsx                      # Footer navigation and legal copy
│   │   ├── HeroSlider.tsx                  # Swiper hero carousel with quick filters
│   │   ├── FeaturedStudios.tsx             # Curated verified studio spaces
│   │   ├── CategoryBrowse.tsx              # Dynamic horizontal category slider
│   │   ├── HowItWorks.tsx                  # Production pipeline steps
│   │   ├── HostGuarantee.tsx               # Host protection standards
│   │   ├── HostMonetizationBanner.tsx      # 3D diorama call-to-action
│   │   ├── StudioCard.tsx                  # Reusable studio display card
│   │   ├── StudioCardSkeleton.tsx          # 1:1 structural skeleton placeholder
│   │   ├── StudioCarousel.tsx              # Studio detail photo viewer
│   │   └── ProtectedRoute.tsx              # Client-side authentication guard
│   ├── context/
│   │   └── AuthContext.tsx                 # Centralized user state and auth mutations
│   ├── lib/
│   │   ├── api.ts                          # Client API client with credentials inclusion
│   │   ├── slug.ts                         # SEO slug generator and ID extractor
│   │   └── utils.ts                        # Currency and date formatters
│   └── types/
│       └── index.ts                        # Unified TypeScript interfaces
├── next.config.ts                          # Image formats, package imports, Turbopack rules
└── package.json                            # Scripts and dependencies
```

---

## Environment Variables

Create `.env.local` inside the `client` directory:

```env
NEXT_PUBLIC_API_URL=https://studiospace-server-c4j2.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://studiospacelive.netlify.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

For local backend development, set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.

---

## Examiner Evaluation Credentials

To inspect authenticated portals (`/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings`, `/saved-studios`):

- **Email:** `examiner@studiospace.io`
- **Password:** `Test1234`
- **One-Click Option:** Click the **Auto Fill** button on the Login page to instantly populate these credentials.
- **Google OAuth Option:** Click **Continue with Google** for 1-click identity verification.

---

## Local Development Workflow

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify compilation and static types:

```bash
npx tsc --noEmit
```
