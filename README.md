# TutorLink

A full-stack tutoring platform where students find and book sessions with tutors. Built as a Level-2 capstone project using Next.js 16 and Express.js with PostgreSQL.

**Live:** https://tutorlinkpro.vercel.app  
**Backend API:** https://tutorlink-server.onrender.com  
**Backend repo:** [TutorLink Server](../TutorLink/)

---

## What it does

Students browse tutors filtered by subject, price range, or search. They book a session with a time slot, pay via SSLCommerz, and after the session they can leave a review. Tutors manage their profile, set their availability, and track incoming bookings. Admins can manage users and the subject category list.

Three roles exist: `STUDENT`, `TUTOR`, `ADMIN`. A user signs up as a student by default. To become a tutor, they fill out a separate tutor profile form after registration.

---

## Stack

**Frontend**
- Next.js 16 (App Router, React 19)
- TypeScript
- Tailwind CSS 4
- Redux Toolkit + RTK Query (API state and caching)
- Better-Auth (session management, client-side)

**Backend**
- Express.js 5 with TypeScript
- PostgreSQL on Neon Cloud
- Prisma ORM (modular schema files)
- Better-Auth (session-based auth, Prisma adapter)
- SSLCommerz for payment processing

---

## Getting started

### Prerequisites

- Node.js 20+
- The backend running locally or pointed to the deployed API

### Clone and install

```bash
git clone <repo-url>
cd tutorlink-client
npm install
```

### Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

To use the deployed backend instead, set it to `https://tutorlink-server.onrender.com`.

### Run

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── (auth)/          # /login, /register
│   ├── (public)/        # /tutors, /tutors/[id], /subjects, /teach-with-us
│   ├── (student)/       # /dashboard, /bookings, /payment/success|fail, /profile
│   ├── (tutor)/         # /tutor/bookings, /tutor/profile, /tutor/availability
│   └── (admin)/         # /admin/users, /admin/categories
├── components/
│   ├── layout/          # Navbar, Footer, DashboardLayout
│   ├── ui/              # Reusable primitives (Button, Input, Card, Badge, ...)
│   └── features/        # Feature-specific components (home, bookings, ...)
└── lib/
    ├── auth-client.ts   # Better-Auth browser client
    ├── use-auth.ts      # Auth hook
    ├── server-api.ts    # Server-side fetch helpers
    └── redux/
        ├── store.ts
        └── api/         # RTK Query slices per resource
```

Route groups (the folders in parentheses) share a layout but have separate auth guards. `AuthGuard.tsx` wraps each group and redirects unauthenticated or unauthorised users.

---

## Auth and roles

Authentication is session-based via [Better-Auth](https://www.better-auth.com/). After sign-in, the session cookie is set by the backend and read on every request.

| Role | Default access |
|------|---------------|
| STUDENT | Browse tutors, book sessions, pay, leave reviews |
| TUTOR | Manage profile and categories, view/update bookings |
| ADMIN | Manage users (ban/unban), manage categories |

An admin account is seeded automatically when the backend starts (see backend `.env` for credentials).

---

## Payment flow

Payments go through SSLCommerz in sandbox mode. The flow is:

1. Student initiates payment → backend calls SSLCommerz init endpoint → returns a gateway URL
2. Student is redirected to the SSLCommerz test page
3. On success/failure/cancel, SSLCommerz POSTs back to the backend
4. Backend updates the payment and booking status, then redirects the student to `/payment/success` or `/payment/fail`

**Test card for sandbox:** Use the test credentials provided in the [SSLCommerz sandbox docs](https://developer.sslcommerz.com/doc/v4/).

---

## Backend setup

The backend lives in the `TutorLink/` directory. A summary of what you need:

```bash
cd TutorLink
npm install
```

`.env` required values:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
SSL_STORE_ID=your-sslcommerz-store-id
SSL_STORE_PASSWORD=your-sslcommerz-password
SSL_IS_LIVE=false
```

```bash
npm run db:migrate:dev   # run Prisma migrations
npm run db:seed          # seed categories and admin user
npm run dev              # start the server on :5000
```

---

## API overview

All routes are prefixed with `/api`.

| Resource | Base path | Notes |
|----------|-----------|-------|
| Auth | `/auth` | Sign up, sign in, sign out, session |
| Tutors | `/tutors` | Browse, filter, profile CRUD |
| Bookings | `/bookings` | Create, list, update status |
| Reviews | `/reviews` | Create, update, list by tutor |
| Payments | `/payment` | Init, success/fail/cancel callbacks |
| Categories | `/categories` | Public read; admin write |
| Admin | `/admin` | User management |
| Stats | `/stats` | Platform counts, featured tutor |

---

## Scripts

```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
