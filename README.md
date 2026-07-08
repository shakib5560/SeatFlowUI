# SeatFlow Frontend Client

A strongly-typed, reactive Next.js 15 App Router frontend application designed as a thin client for the SeatFlow NestJS backend. It provides room booking directories, availability calendar checks, an administrative approval portal, and system health status.

---

## Technical Stack

* **Core**: Next.js 15 (App Router), React 19, TypeScript
* **State & Data Caching**: TanStack Query (React Query v5)
* **HTTP Client**: Axios
* **Forms & Validation**: React Hook Form, Zod
* **Styling & Components**: Tailwind CSS, shadcn/ui
* **Utility Libraries**: date-fns, uuid, sonner

---

## Folder Structure

```
src/
├── app/               # Next.js pages, routing & layouts
│   ├── admin/         # Admin dashboard pages
│   ├── bookings/      # Public booking directory pages
│   ├── health/        # Diagnostics monitoring page
│   ├── rooms/         # Meeting rooms & calendar detail pages
│   ├── globals.css    # Global CSS styles
│   └── layout.tsx     # Site-wide layouts (providers, nav)
├── components/        # Reusable UI component modules
│   └── ui/            # shadcn base atomic components
├── services/          # Stateless raw backend API clients
├── hooks/             # TanStack React Query queries and mutations
├── types/             # Explicit backend request & response types
├── lib/               # Shared libraries (Axios instances, helpers)
└── providers/         # Global React context providers
```

---

## Installation & Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** and **pnpm** installed globally.

### 2. Configure Environment Variables
Create an `.env.local` file in the project root:
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
*(Ensure this matches the active port of your running SeatFlow NestJS backend).*

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Run Development Server
```bash
pnpm dev
```
The application runs locally at `http://localhost:3000` (or the next available port).

---

## API Layer Explanation (`lib/api.ts`)

API requests are managed by a centralized, configured Axios client.
* **JSON Serialization**: Configured with standard headers.
* **Timeout Limit**: Fails after 15 seconds (`15000` ms) to support fallback retry operations.
* **Request Interceptor**: Checks target URLs on dispatch. If the request begins with `/admin` or includes it, the interceptor extracts `seatflow_admin_token` from `localStorage` and appends it as `Authorization: Bearer <token>`. Public endpoints are queried header-free.

---

## Authentication Flow

1. The frontend features a bearer-token based credential flow.
2. When accessing any route under `/admin/*`, the layout check executes:
   - If `localStorage.getItem('seatflow_admin_token')` is empty, it halts page rendering and prompts for a token input.
   - If present, the page content renders.
3. The Axios request interceptor injects the stored token into HTTP headers on admin service calls.
4. If the backend rejects a token with `401 Unauthorized` or `403 Forbidden`, an error banner is displayed. Administrators can sign out (clearing the token) and enter a new token.

---

## How `requestId` (Idempotency) Works

To block duplicate reservations and manage networking failures gracefully:
1. When the booking detail page renders, the client instantiates a unique UUID v4 token.
2. During booking creation form submission, this UUID is bound to the payload's `requestId` property AND injected as the `x-request-id` header in the HTTP request.
3. In case of network drops, service timeouts, or generic errors, the user is prompted to click a **Retry** button.
4. Clicking **Retry** re-submits the exact same parameters using the **original UUID** from state. It does NOT generate a new UUID.
5. The backend checks Redis for matching request IDs. If found, it drops duplicate transaction writes and returns the existing booking immediately, securing the flow.

---

## How URL State Synchronization Works

The frontend maintains query parameters in the browser address bar as the source of truth for dashboard states.
* **Bookings View**: Filtering by status, room, email string, sorting, order, or page pushes updates to the URL via `next/navigation`.
* **Room Detail View**: Selecting check-in/check-out dates pushes parameter coordinates (`?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`) to the URL.
* **Benefits**:
  - Direct sharing: Sharing links preserves list views.
  - Page refresh: Reloading the page does not wipe inputs.
  - No client state logic: URL hooks trigger queries automatically.

---

## How to Add New API Endpoints in the Future

To extend the system with new backend routes:
1. **Define Types**: Add request/response interfaces in `src/types/api.ts`.
2. **Add Service Call**: Add stateless API functions to the corresponding service class in `src/services/` using the custom Axios instance.
3. **Wrap in React Query**: Create a query hook (for GET) or mutation hook (for POST/PATCH/DELETE) in `src/hooks/`. Configure proper cache invalidation so relevant datasets update.
4. **Render in UI**: Import and call the query hook inside your React components.
