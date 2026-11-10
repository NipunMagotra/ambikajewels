# PRODUCTION DEPLOYMENT GUIDE — NETLIFY & SUPABASE

---

## 1. Hosting Architecture Overview

Ambika Jewels is optimized for high-availability serverless deployment:
- **Web App & API Hosting:** Netlify via `@netlify/plugin-nextjs`.
- **Database & Asset Storage:** Supabase Cloud (AWS ap-south-1 Mumbai region recommended for lowest latency to Jammu).
- **Edge Routing & Proxy:** Next.js Edge Middleware for zero-trust session validation and header security.

---

## 2. Step-by-Step Production Deployment

### Step 1: Connect Git Repository to Netlify
1. Log into your Netlify account (`app.netlify.com`).
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Select `NipunMagotra/ambikajewels`.
4. Build Settings:
   - **Base directory:** Leave blank (root).
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Plugin:** `@netlify/plugin-nextjs` is already pre-configured in `package.json` and `netlify.toml`.

### Step 2: Configure Production Environment Variables
In the Netlify Site Dashboard:
1. Navigate to **Site configuration** → **Environment variables**.
2. Add all required production variables as detailed in [ENVIRONMENT_VARIABLES.md](file:///d:/Client%20Projects/Ambika%20Jewels/docs/deployment/ENVIRONMENT_VARIABLES.md).
3. Ensure `NODE_ENV` is set to `production`.

### Step 3: Run Database Migrations on Supabase
1. In Supabase Dashboard, open the **SQL Editor**.
2. Run `supabase/schema.sql` (if creating a fresh project).
3. Run `supabase/migrations/20261110_staff_accounts_and_revocation.sql` to establish staff tables, session revocation, and RLS policies.

### Step 4: Configure Storage Bucket
1. Go to Supabase **Storage** → Create a bucket named `products`.
2. Set bucket to **Public** for fast CDN delivery of jewellery images.

### Step 5: Configure Custom Domain & SSL
1. In Netlify Dashboard → **Domain management** → **Add custom domain**.
2. Enter `ambikajewelsonline.com`.
3. Update DNS records with your registrar:
   - `CNAME` for `www` → your Netlify subdomain
   - `A Record` for `@` → `75.2.60.5`
4. Wait for automatic Let's Encrypt SSL certificate provisioning.

### Step 6: Post-Deployment Smoke Verification
Follow the steps in [MANUAL_ACTIONS_REQUIRED.md](file:///d:/Client%20Projects/Ambika%20Jewels/docs/deployment/MANUAL_ACTIONS_REQUIRED.md) to conduct the ₹100 live transaction test.
