<div align="center">

# 🔧 FixMate

**Book verified repair technicians in minutes, and pay only after the job is done.**

[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-UI-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Auth-000000)](https://www.better-auth.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-shadcn%2Fui-06B6D4?logo=tailwindcss&logoColor=white)](https://ui.shadcn.com/)

[Live Site](#-live-demo) · [Features](#-key-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Overview](#-api-overview)

</div>

---

## 📖 About the Project

**FixMate** is a full-stack repair marketplace that connects customers with verified technicians for smartphones, laptops, AC, refrigerators, TVs, washing machines and electrical work. This repository is the **Next.js client**; the REST API and payment handling live in a separate Node/Express service.

### Purpose

Finding a trustworthy repair person is slow and risky: prices are unclear, quality varies, and people are often asked to pay before the work is done. FixMate solves this with a simple, transparent flow:

1. **Technicians** list their services, and an **admin** approves them before they go public.
2. **Customers** browse approved services, send a repair request, and track its progress.
3. The technician completes the job and sets the final amount.
4. The customer **pays securely online, only after the work is finished**.

---

## 🌐 Live Demo

| | |
|---|---|
| **Live site** | [https://fix-mate-eight-xi.vercel.app](https://fix-mate-eight-xi.vercel.app) |
| **API server** | [https://fix-mate-server-omega.vercel.app](https://fix-mate-server-omega.vercel.app) |
| **Client repository** | [github.com/mdalshaharia/fix-mate](https://github.com/mdalshaharia/fix-mate) |

> Accounts are created through `/sign-up` as either a **customer** or a **technician**. There is intentionally no public admin sign-up — see [Create an admin](#5-create-an-admin).

**Test card for payments (Stripe test mode):** `4242 4242 4242 4242`, any future expiry date, any CVC.

---

## ✨ Key Features

### 🌍 Public
- **Animated hero slider** with staggered text and button animations (respects "reduce motion").
- **Featured services**: the 6 latest approved and available services, in equal-height cards.
- **Popular categories** that open the services page already filtered.
- **How it works** and **Why choose us** sections.
- **Responsive navbar** with a top contact strip, mobile menu and role-aware account menu.
- **Professional footer** with quick links, categories, contact details and social links.

### 🔍 Services Browsing
- **Server-side search** by title or category (MongoDB, not client-side filtering).
- **Filters** for category and service mode, plus **sorting** by price (low to high, high to low) or newest.
- **Pagination**, with all filters kept in the URL, so they survive a page reload and can be shared.
- **Service details page** with a large image, price, duration, service mode, area and technician summary.

### 👤 Customer
- **Repair request form** with validation (valid phone, full address, future date only, minimum 20-character problem description).
- **Duplicate protection**: a second active request for the same service is refused by the server.
- **My Bookings** as a table (cards on mobile) with status and payment badges.
- **Cancel** a request while it is still *Requested*, with a confirmation modal.
- **Secure Stripe checkout** created server-side, only once a job is completed.
- **Payments page** with total paid, amount due, payment history and copyable transaction IDs.
- **Payment success and cancel pages** shown as top-fixed modals.

### 🛠️ Technician
- **Add service** with image upload (via ImgBB), a preview and a copyable image link.
- **My Services**: edit (which sends the service back to *Pending*), delete with confirmation, and an availability switch that hides a service from public pages.
- **Manage Requests**: accept or reject, start work, and mark completed with a final amount.
- **Status filter**, and only the valid action buttons are shown for each booking status.

### 👑 Admin
- **Overview** with total users, total technicians and pending services.
- **Manage Users**: view every account, change roles, and ban or unban users.
- **Service Approval**: approve or reject services, with pending services shown first.
- **All Bookings**: a read-only view of every booking, with a status filter.
- **Transactions**: every payment, with total revenue, transaction count and average job value.

### 🏗️ Platform
- **Role-based dashboard** with a collapsible sidebar that changes per role.
- **Server-side route protection** via `src/proxy.js` (session-cookie check) plus a full session read in the dashboard layout.
- **Shared profile page** to update name, phone, area, bio and photo. Changes show in the navbar immediately.
- **Central skeleton loaders** that match each page layout.
- **Error boundaries** (`app/error.jsx`, `app/dashboard/error.jsx`, `app/global-error.jsx`) with a retry action and an error reference (digest) for server-side debugging.
- **Toast notifications**, form validation and clear empty and error states throughout.

---

## 🔒 Security

- **Server-enforced roles.** Every protected API route and dashboard layout reads the user's role from the database, never from the client.
- **Ownership checks inside the database query**, so users can only touch their own bookings, services and payments.
- **Valid status transitions only.** A booking can't skip steps, and each update is a single atomic query.
- **Payment amounts come from the database**, never from the browser.
- **Stripe webhook** with signature verification and idempotent payment records (no duplicates on retries).
- **Role escalation blocked.** Users can't promote themselves through profile updates or sign-up.
- **Input validation** and regex escaping on all search and filter inputs.
- **Secure session cookies**; the API calls use a short-lived JWT obtained from Better Auth over HTTPS.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Cache Components, Partial Prefetching) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui + Base UI, Lucide icons, Sonner toasts |
| **Authentication** | Better Auth (email/password + Google, MongoDB adapter, JWT plugin) |
| **Database** | MongoDB (native driver) |
| **Payments** | Stripe (server-created Checkout + webhooks) |
| **Image hosting** | ImgBB |
| **API** | Node.js / Express (separate repository) |
| **Deployment** | Vercel |

---

## 🗂️ Project Structure

```
a9_client/
├── src/
│   ├── app/
│   │   ├── page.js                 # Home
│   │   ├── about/                  # About page
│   │   ├── services/               # Listing, filters, [id] details
│   │   ├── payment/                # success / cancel result pages
│   │   ├── sign-in/ sign-up/       # Auth pages
│   │   ├── dashboard/
│   │   │   ├── customer/           # Overview, bookings, payments
│   │   │   ├── technician/         # Overview, services, add service, requests
│   │   │   ├── admin/              # Overview, users, services, bookings, transactions
│   │   │   └── profile/            # Shared profile page
│   │   ├── api/auth/[...all]/      # Better Auth handler (+ /api/auth/token)
│   │   ├── layout.js               # Root layout, fonts, global metadata
│   │   ├── error.jsx               # App-level error boundary
│   │   ├── global-error.jsx        # Root fallback error boundary
│   │   └── not-found.jsx           # Custom 404
│   ├── components/
│   │   ├── dashboard/              # Shell, sidebar, topbar, tables and forms per role
│   │   ├── services/               # Booking form
│   │   ├── payments/               # Payment modal / success
│   │   ├── hero/ FeaturedSection/ CategoriesAndTrust/ howItWorks/ Timeline/
│   │   ├── Navbar/ Footer/ layout/ # Site chrome
│   │   ├── ui/                     # shadcn/ui primitives
│   │   ├── utils/                  # Shared page helpers (cards, filters, badges…)
│   │   └── Skeletons/              # Central loading skeletons
│   ├── lib/                        # Auth, JWT fetch helper, services API, ImgBB upload
│   └── proxy.js                    # Next.js 16 proxy (middleware) for /dashboard
├── public/                         # Images, logos, favicons
├── scripts/seedService.mjs         # Seed one service into MongoDB
├── next.config.mjs                 # Security headers, images, cacheComponents
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9 or later
- A running **FixMate API server** (separate repository)
- A MongoDB database (local or Atlas) shared with the API server
- A Google OAuth app (for "Continue with Google")
- An [ImgBB](https://api.imgbb.com/) API key
- A Stripe account in test mode (handled by the API server)

### 1. Clone the client

```bash
git clone https://github.com/mdalshaharia/fix-mate.git a9_client
cd a9_client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# API server (Express)
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_long_random_secret_at_least_32_chars
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (same database the API server uses)
DB_URL=mongodb://localhost:27017/fix-mate

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB (used from the browser, hence NEXT_PUBLIC_)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SERVER_BASE_URL` | ✅ | Base URL of the Express API. Also used by the browser. |
| `BETTER_AUTH_SECRET` | ✅ | Must be **at least 32 characters** in production, otherwise the app refuses to start. |
| `BETTER_AUTH_URL` | ✅ | Origin of this client (e.g. `http://localhost:3000`). |
| `DB_URL` | ✅ | MongoDB connection string. Must point to the same database as the API server. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ✅ | Needed for Google sign-in. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ✅ | Used for technician image uploads. |

> In production the URL must be **HTTPS** for `BETTER_AUTH_URL`, because Better Auth issues `__Secure-` session cookies.

### 4. Run the project

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API must also be running at `NEXT_PUBLIC_SERVER_BASE_URL`.

### 5. Create an admin

Sign up normally, then set the user's `role` to `admin` in the `user` collection in MongoDB, and sign in again. There is intentionally no public sign-up path for admins.

### Optional: seed a demo service

```bash
node --env-file=.env scripts/seedService.mjs
```

Optional overrides: `SERVICE_TITLE`, `SERVICE_CATEGORY`, `SERVICE_DESCRIPTION`, `SERVICE_IMAGE`, `SERVICE_PRICE`, `SERVICE_DURATION`, `SERVICE_MODE`, `SERVICE_AREA`, `TECHNICIAN_NAME`, `TECHNICIAN_EMAIL`, `APPROVAL_STATUS`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack). |
| `npm run build` | Create an optimized production build. |
| `npm start` | Start the production server. |
| `npm run lint` | Run ESLint. |

---

## 🔐 How Authentication Works

1. **Better Auth** runs inside this app at `/api/auth/[...all]` using the MongoDB adapter.
2. Sign-in/sign-up supports **email + password** and **Google**.
3. The **JWT plugin** exposes a token at `/api/auth/token`; `src/lib/getTokenFromClient.js` fetches it and sends `Authorization: Bearer <token>` with every API request.
4. `src/proxy.js` (Next.js 16's middleware) guards `/dashboard/*` by checking for a session cookie before the page is rendered.
5. `src/app/dashboard/layout.js` reads the full session on the server and redirects users to their role's dashboard (`customer`, `technician`, `admin`).

---

## 🔌 API Overview

All routes below are served by the **Express API** (`NEXT_PUBLIC_SERVER_BASE_URL`), except the Better Auth routes on this client.

| Area | Examples | Access |
|---|---|---|
| **Auth (client)** | `/api/auth/[...all]`, `/api/auth/token` | Everyone |
| **Public** | `GET /services`, `GET /services/featured`, `GET /services/:id` | Everyone |
| **Customer** | `POST /bookings`, `GET /bookings/my`, `PATCH /bookings/:id/cancel`, `GET /payments/my` | Customer |
| **Payments** | `POST /payments/checkout`, `GET /payments/verify` | Customer |
| **Technician** | `POST /services`, `GET /services/my`, `PUT /services/:id`, `GET /bookings/technician`, `PATCH /bookings/:id/status` | Technician |
| **Admin** | `GET /admin/stats`, `/admin/users`, `/admin/services`, `/admin/bookings`, `/admin/payments` | Admin |
| **Webhook** | `POST /webhooks/stripe` | Stripe (signature verified) |

### Booking lifecycle

```
requested ──► accepted ──► in-progress ──► completed ──► paid
    │
    ├──► rejected   (by technician)
    └──► cancelled  (by customer)
```

---

## 🛣️ Roadmap

- [ ] Customer reviews and ratings
- [ ] In-app notifications
- [ ] Downloadable invoices
- [ ] Service search by location
- [ ] Technician earnings dashboard

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📬 Contact

**mdalshaharia**
- Email: [mdshahriar376@gmail.com](mailto:mdshahriar376@gmail.com)
- GitHub: [@mdalshaharia](https://github.com/mdalshaharia)

---

<div align="center">

Made with ❤️ in Bangladesh

</div>
