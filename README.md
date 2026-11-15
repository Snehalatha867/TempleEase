# Temple Ease — Smart Temple Information & Visitor Assistance System

**One Platform. Many Temples. Everything a Devotee Needs.**

Temple Ease is a centralized full-stack web platform built as a Community Service Project to help first-time and regular devotees easily discover and access verified visitor information across major temples in India.

---

## Key Features

1. **Multi-Temple Directory & Search (`/temples`, `/temples/:idOrSlug`)**
   - Filter by state, presiding deity, or keyword search across 12+ seeded Indian temples.
   - Dedicated temple pages featuring history, significance, architecture, traditions, opening/darshan timings, dress code, rules, official portal verification links, prasadam counters, and donation trust info.
2. **Pooja & Seva Booking System (`/booking`)**
   - Select temple → seva → preferred date & slot → devotee details → instant booking confirmation with unique Booking ID (`TE-BK-YYYY-XXXX`) and scannable QR verification pass.
3. **Interactive Temple Calendar (`/calendar`)**
   - View festivals, special sevas, timing changes, and announcements filtered by temple or month.
4. **Personalized Visitor Trip Planner (`/planner`)**
   - Generates a structured temple itinerary tailored to arrival time, elderly/wheelchair priority needs, children, and transport mode.
5. **QR Code Placard System (`/qr`)**
   - Generates downloadable, printable QR placards for every temple URL (`/temples/:slug`) for entrance gopuram signage.
6. **Essential Pilgrim Services**
   - Daily Pooja Schedules (`/timings`), Facilities (`/facilities`), Parking Zones (`/parking`), Nearby Hospitals (`/hospitals`), 24x7 Emergency Helplines (`/emergency`), Visitor Guidelines (`/guidelines`), Interactive Maps (`/map`), Announcements (`/announcements`), Devotee Favourites (`/favourites`), Feedback & Ratings (`/feedback`), and Multi-Language Support (EN / TE / HI / TA / KN).
7. **Role-Based Authentication & Admin Dashboard (`/admin`)**
   - Real `bcryptjs` password hashing + JWT authentication (`USER` and `ADMIN` roles).
   - Full admin CRUD for temples, poojas, schedules, facilities, parking, hospitals, emergency contacts, guidelines, announcements, calendar events, bookings, and contact messages.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Lucide React
- **Backend:** Node.js, Express.js, TypeScript (`tsx`)
- **Database:** MongoDB & Mongoose (with automatic seeding; in-memory fallback is for local development only)
- **Security & Utilities:** `bcryptjs`, `jsonwebtoken`, `qrcode`, `cors`, `dotenv`

---

## Project Structure

```text
├── public/images/                # Verified production temple images
├── server/
│   ├── config/db.ts              # MongoDB connection manager & status reporter
│   ├── controllers/              # Modular Express controllers (auth, temple, service, booking, admin)
│   ├── data/store.ts             # Mongoose repository with a local development fallback
│   ├── middleware/auth.ts        # JWT verification, requireAuth, requireAdmin, optionalAuth
│   ├── models/
│   │   ├── mongooseModels.ts     # 18 Mongoose schemas & models
│   │   └── types.ts              # Shared TypeScript interfaces
│   ├── routes/api.ts             # REST API routing under /api
│   └── seed/
│       ├── seedData.ts           # Rich multi-temple seed dataset
│       └── seeder.ts             # Idempotent MongoDB database initializer
├── src/
│   ├── components/               # Reusable layout, cards, search, and UI components
│   ├── context/                  # AuthContext & LanguageContext
│   ├── pages/                    # 25+ interactive React pages
│   ├── services/api.ts           # Axios HTTP client with Bearer JWT interceptor
│   └── utils/                    # Image resolution & helper utilities
├── server.ts                     # Express + Vite server entrypoint (port 3000)
└── .env.example                  # Environment variables template
```

---

## Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```env
NODE_ENV=development
MONGODB_URI="mongodb://127.0.0.1:27017/temple_ease"
JWT_SECRET="generate-a-private-value-at-least-32-characters-long"
PORT=3000
CLIENT_URL="http://localhost:3000"
INITIAL_ADMIN_NAME=""
INITIAL_ADMIN_EMAIL=""
INITIAL_ADMIN_PHONE=""
INITIAL_ADMIN_PASSWORD=""
VITE_API_BASE_URL=""
```

- Generate a private local JWT secret with Node.js: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- `MONGODB_URI` can point to local MongoDB or MongoDB Atlas. In production, a working URI is mandatory; the server exits instead of using volatile in-memory data.
- The `INITIAL_ADMIN_*` values are for the first production startup only when the database has no admin user. The password must be at least 12 characters and is hashed before storage. Remove these values from Render after the first successful admin creation.
- `VITE_API_BASE_URL` is a frontend build-time setting. Leave it empty for same-origin local development; set it to the Render service origin when building on Vercel.
- When MongoDB is connected, the backend seeds empty collections on startup.

---

## Running Locally

```bash
cp .env.example .env
npm ci
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`. Set a generated `JWT_SECRET` in `.env` before starting. The development server starts Express and Vite together at `http://localhost:3000`. To check the project, run `npm run lint` and `npm run build`.

---

## Production Deployment (GitHub, Atlas, Render, and Vercel)

The Render service runs the existing Express backend and builds the `dist/` frontend as well. Vercel separately builds and serves the public frontend. The browser sends API calls to Render using `VITE_API_BASE_URL`; Render permits the frontend origin listed in `CLIENT_URL`.

### 1. Prepare and upload the source to GitHub

1. Create an empty GitHub repository and upload the TempleEase source folder.
2. Do not upload `.env`, MongoDB credentials, or generated secrets. `.gitignore` excludes `.env*` while keeping `.env.example`.
3. Ensure `package.json`, `package-lock.json`, `render.yaml`, `vercel.json`, and the application source are included. Use npm for deployment because Render is configured with `npm ci`.

If initializing Git locally, run these from the TempleEase folder and replace the remote URL with your own:

```bash
git status
git add .
git commit -m "Prepare TempleEase for deployment"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_NAME>/<YOUR_REPOSITORY>.git
git push -u origin main
```

If this folder already belongs to a Git repository, inspect `git status` and the existing remote first; do not reinitialize or overwrite an existing remote.

### 2. Create MongoDB Atlas storage

1. Create an Atlas project and cluster.
2. Create a database user with a strong unique password and read/write access to the application database.
3. Configure Atlas Network Access to allow the Render service’s outbound IP addresses where your Render plan provides stable addresses. Avoid broad public access unless necessary; if broad access is unavoidable, use a least-privilege database user and strong credentials.
4. Copy the Atlas `mongodb+srv://` connection string. Replace its username/password placeholders, URL-encode special characters in the password, and use the `temple_ease` database name.
5. Keep the final connection string private. Enter it only in Render’s secret environment variable setting.

The existing server seeds empty collections after its first successful database connection. It does not replace existing collection contents.

### 3. Deploy the backend to Render

1. In Render, create a Blueprint from the GitHub repository containing `render.yaml`, or create a Node web service with these exact commands:
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `npm start`
   - **Node:** use the version constrained by `package.json` (`^22.12.0 || >=23.5.0`).
2. Set these environment variables in Render. The Blueprint declares the secret keys but intentionally does not store their values in Git:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your private Atlas URI
   - `JWT_SECRET` = output from `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`; generate it privately and do not reuse the example value.
   - `CLIENT_URL` = the exact Vercel production origin, for example `https://temple-ease.vercel.app` (no trailing slash). Multiple exact origins can be comma-separated.
   - `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PHONE`, `INITIAL_ADMIN_PASSWORD` = a real initial admin’s details and a unique password of at least 12 characters. Set these only if the Atlas database has no admin; remove the values from Render after the first successful startup.
3. Deploy, then confirm the Render log shows a successful MongoDB connection and creation of the initial admin if needed. The API status endpoint is `https://<RENDER_SERVICE>.onrender.com/api/status`; confirm its database status reports connected.

Render supplies `PORT`; do not hard-code it in Render settings. The server binds to `0.0.0.0`.

### 4. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel and select the TempleEase project root as the **Root Directory**.
2. Use **Build Command** `npm run build` and **Output Directory** `dist`. Vercel detects the Vite project; `vercel.json` rewrites the application’s existing page routes to the SPA entry point and does not rewrite `/api` or image/static paths.
3. Set this Vercel environment variable for Production (and Preview only if you intend to allow preview origins):
   - `VITE_API_BASE_URL` = `https://<RENDER_SERVICE>.onrender.com` (no trailing slash).
4. Deploy or redeploy after setting the variable. Vite embeds this value at build time.
5. If you use a custom Vercel domain, update Render’s `CLIENT_URL` to that exact origin and redeploy/restart the Render service.

### 5. Post-deployment checks

- Open the Vercel URL, refresh `/temples`, `/temples/<slug>`, `/login`, and `/admin`, and confirm the SPA loads.
- Check that images from `/images/...` load; these files are already served from the repository’s `public/images` directory.
- Search temples and open a detail page; verify browser network requests target the Render `/api` host.
- Register a test user, log in, then verify the new user exists in Atlas. Do not test with real personal data.
- Verify a guest can submit a booking and create a visit plan; verify an authenticated user can only list, retrieve, cancel, or delete their own records, while an admin can manage all records.
- Check `/api/status` and Render logs for database/CORS errors.
- Test authorized temple/admin CRUD only after confirming the initial admin account is secured.

### Production blockers to resolve before public launch

- A new production database no longer receives the local demo users. If an Atlas database was already seeded by the previous version, its known demo admin is not automatically deleted or changed; rotate its password or remove that user before public launch. Review any bookings/plans created before this access-control change, because older requests could associate a record with a client-supplied user ID.
- Guest bookings and visit plans are still accepted and stored in MongoDB. Retrieval and management require authentication; user accounts can only access records associated with their verified account, and admin access is role-protected.
- Production build, Render startup, live Atlas writes, Vercel route refreshes, CORS, and mobile behavior still need verification in the target hosting accounts. No deployment has been run as part of this guide.
