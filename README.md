# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

> **Live Client Application:** [https://studiospace.vercel.app](https://studiospace.vercel.app)  
> **Live API Backend:** [https://studiospace-api.onrender.com](https://studiospace-api.onrender.com)  
> **Examiner Test Credentials:** `examiner@studiospace.io` / `Test1234`

---

## Key Platform Features

- **Dynamic Workspaces Marketplace:** Discover, filter, and inspect verified daylight lofts, soundproof audio suites, 4K podcast lounges, and artisan fabrication studios across major creative hubs.
- **Double-Booking Collision Prevention (Challenge 2):** High-precision time-interval overlap validation in MongoDB before reserving any time slot, rejecting collision requests with informative feedback.
- **JWT Security with HTTPOnly Cookies (Challenge 1):** Robust authentication tokens stored in secure, `httpOnly` cross-origin cookies protecting mutations (`POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings`).
- **Dark/Light Theme Customization (Challenge 3):** Full system dark-first luxury design system powered by Tailwind CSS and `next-themes` with zero layout shift.
- **Automated PDF Invoice Receipts:** Downloadable official booking invoices generated dynamically using `jsPDF` for confirmed creative reservations.
- **Image Upload Pipeline:** Native integration with ImgBB API for seamless hosting of studio photos alongside direct URL support.
- **Responsive Layout & Accessibility:** Strict compliance with `baseline-ui` standards, fluid typography (`Syne` + `Plus Jakarta Sans`), and responsive navigation for mobile, tablet, and desktop screens.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 14 / 16 (App Router), React 19, TypeScript |
| **Styling & Design System** | Tailwind CSS, Lucide Icons, Syne & Plus Jakarta Sans Fonts |
| **Interactive Components** | Swiper.js (Hero Slider), Sonner (Toasts), Next-Themes |
| **Backend API** | Express.js, Node.js, REST Architecture |
| **Database & ODM** | MongoDB Atlas, Mongoose 8/9 |
| **Security & Auth** | JSON Web Tokens (JWT), HTTPOnly Cookies, Cookie-Parser, CORS |
| **Document Export** | jsPDF Client Receipt Generator |

---

## Examiner & Evaluator Test Credentials

For quick evaluation of protected routes (`/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings`):

- **Examiner Email:** `examiner@studiospace.io`
- **Password:** `Test1234`
- *(Or click the **Auto Fill** button directly on the Login page)*
- Alternatively, you can use **Continue with Google** for 1-click test access.

---

## Local Setup & Installation

### 1. Backend Server Setup

```bash
cd server
npm install
cp .env.example .env
# Ensure MONGODB_URI and JWT_SECRET are configured in .env
npm run seed     # (Optional) Pre-populates database with 6 verified creative studios
npm run dev      # Starts server on http://localhost:5000
```

### 2. Frontend Client Setup

```bash
cd client
npm install
cp .env.example .env.local
npm run dev      # Starts Next.js development server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
