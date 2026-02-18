This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->

#  Smart Bookmark App

A real-time bookmark manager built with Next.js App Router, Supabase, and Tailwind CSS.
Users can securely log in with Google, add/delete bookmarks, and see updates instantly across tabs.

---

## Live Demo

 **Vercel URL:** smartbookmarkapp-five.vercel.app

 **GitHub Repo:** https://github.com/Itssunil01/smart-bookmark-app

---

##  Features

*  Google OAuth authentication (Supabase Auth)
*  Add bookmarks (title + URL)
*  Delete bookmarks
*  Bookmarks are private per user (RLS enabled)
*  Real-time updates across tabs (Supabase Realtime)
*  Fully responsive UI
*  Deployed on Vercel

---

##  Tech Stack

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
* **Backend-as-a-Service:** Supabase (Auth, Postgres, Realtime)
* **Deployment:** Vercel

---

##  Database Schema

```sql
bookmarks (
  id uuid primary key,
  user_id uuid references auth.users,
  title text,
  url text,
  created_at timestamp
)
```

---

##  Security (Row Level Security)

Row Level Security (RLS) ensures users can only access their own bookmarks.

**Policy used:**

```sql
using (auth.uid() = user_id)
with check (auth.uid() = user_id)
```

This guarantees data privacy between users.

---

##  Real-Time Implementation

Supabase Realtime listens to Postgres changes:

* Subscribed to `bookmarks` table
* Triggers UI refresh on insert/delete
* Works across multiple tabs

Additionally, **optimistic UI updates** were implemented to remove perceived latency.

---

## Challenges Faced & Solutions

### 1. Google OAuth Provider Error

**Problem:**
Received error: `Unsupported provider: provider is not enabled`

**Solution:**
Enabled Google provider in Supabase and configured OAuth credentials in Google Cloud Console with the correct redirect URI.

---

### 2. Slow UI Updates After Add/Delete

**Problem:**
Bookmarks appeared only after refresh or with delay.

**Solution:**

* Implemented optimistic UI updates
* Kept Supabase Realtime as secondary sync layer
* Result: instant UI response

---

### 3. Row Level Security Blocking Operations

**Problem:**
Delete operations initially failed due to RLS restrictions.

**Solution:**
Created proper policy:

```sql
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id)
```

##  Local Development

```bash
git clone <your-repo>
cd smart-bookmark-app
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

##  Deployment

The app is deployed on **Vercel** with environment variables configured in the dashboard.

---

##  Author

Sunil Kumar Bal



---



