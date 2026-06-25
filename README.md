# LendTrack

A full-stack application for tracking money you lend to and borrow from friends and family — with interest calculations, due-date reminders, document uploads, and family sharing.

Built as a portfolio-grade project: React + Vite + Tailwind on the frontend, Node/Express + MongoDB on the backend.

---

## Tech stack

**Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, React Hook Form, Axios, Recharts, Framer Motion
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT auth, bcrypt

## Design system

- **Fonts:** Fraunces (display/numbers), Inter (body/UI), JetBrains Mono (amounts & dates)
- **Palette:** deep ledger navy (`#0B1F3A`), warm paper cream (`#F7F4EC`), money-lent green (`#2F9E6E`), money-borrowed amber (`#D9763B`)
- **Signature motif:** a ledger tick-mark divider (`.ledger-divider` in `index.css`) used under section headers, echoing paper ledger columns
- Full dark mode support via Tailwind's `class` strategy

---

## Project structure

```
lendtrack/
├── backend/
│   ├── config/          # DB connection, email transport
│   ├── controllers/      # Route handlers (business logic)
│   ├── middleware/       # auth, error handling, file upload
│   ├── models/           # Mongoose schemas: User, Loan, PaymentHistory, Notification, FamilyGroup
│   ├── routes/           # Express routers
│   ├── utils/            # token gen, interest calc, email templates, reminder cron, seed script
│   ├── uploads/          # uploaded loan documents (gitignored)
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # ui/, layout/, dashboard/, loans/, calculator/, family/, notifications/, charts/
        ├── pages/        # one file per route (14 pages)
        ├── layouts/       # AppLayout (sidebar+topbar), AuthLayout (split screen)
        ├── hooks/         # useLoans, useDebounce, useClickOutside
        ├── services/      # one Axios-based service module per API resource
        ├── context/       # AuthContext, ThemeContext, NotificationContext
        ├── routes/        # ProtectedRoute, PublicRoute
        └── utils/         # currency/date formatting, validators
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- (Optional, for emails) An SMTP account — Gmail App Password works fine for development

### 1. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, JWT_RESET_SECRET, SMTP_* credentials
npm install
npm run dev          # starts on https://lendtrack-b97j.onrender.com/api
```

To load demo data (one user + 5 sample loans):
```bash
npm run seed
# log in with demo@lendtrack.app / demo1234
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=https://lendtrack-b97j.onrender.com/api
npm install
npm run dev             # starts on http://localhost:5173, https://boobesh-lend-track.vercel.app
```

The Vite dev server proxies `/api` and `/uploads` to the backend, so the `.env` value matters mainly for production builds.

### 3. Build for production

```bash
cd frontend
npm run build      # outputs to frontend/dist
```

Serve `dist/` with any static host (Vercel, Netlify, Nginx) and deploy `backend/` to any Node host (Render, Railway, EC2, etc.), pointing `VITE_API_URL` at your deployed API URL.

---

## Environment variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` / `JWT_EXPIRE` | Auth token signing secret + expiry |
| `JWT_RESET_SECRET` / `JWT_RESET_EXPIRE` | Reserved for future use; reset tokens currently use crypto random + hash |
| `SMTP_*`, `EMAIL_FROM` | Used for password reset and family invite emails |
| `CLIENT_URL` | Used to build email links (reset password, invite accept) and for CORS |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## Feature checklist

- [x] Register / Login / Forgot password / Reset password / Protected routes
- [x] Dashboard: totals, upcoming due dates, monthly chart, recent transactions
- [x] Loan CRUD, mark as paid (full or partial), document upload, search & filter, pagination
- [x] Interest calculator: simple & compound, configurable compounding frequency
- [x] Reminder system: daily cron job (`node-cron`) classifies loans into due today / upcoming / overdue, emails + in-app notifications + browser push notifications
- [x] Family sharing: invite by email, admin/member roles, shared visibility, role-gated edit/delete
- [x] Export to PDF (`pdfkit`) and Excel (`exceljs`)
- [x] Dark mode, loading spinners, toast notifications, responsive layout throughout

## Notes on data access rules

- A user without a family group only sees their own loans.
- Once part of a family group, a user sees their own loans **plus** every loan tagged with that `familyGroup`.
- Only the loan's creator, or an **admin** within the shared family group, can edit/delete/upload documents/mark-paid on a given loan. Members have read-only access to shared records.

## Known limitations / things to harden before real production use

- Rate limiting is in-memory (per Node process) — use a Redis-backed limiter behind a load balancer.
- File uploads are stored on local disk (`backend/uploads`) — swap for S3/Cloudinary for multi-instance deployments.
- The reset-password and family-invite tokens are not rotated/invalidated on logout — fine for a portfolio project, worth revisiting for production.
