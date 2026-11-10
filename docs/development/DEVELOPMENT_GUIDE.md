# LOCAL DEVELOPMENT & CODEBASE CONVENTIONS

---

## 1. Quick Start

### Prerequisites
- **Node.js:** v20.x or higher (Tested on Node.js v24)
- **Package Manager:** npm v10.x+
- **Git**

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/NipunMagotra/ambikajewels.git
cd "Ambika Jewels"

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Codebase Conventions

1. **Next.js App Router Structure:**
   - Pages live in `src/app/**/page.tsx`.
   - API endpoints live in `src/app/api/**/route.ts`.
   - Layouts live in `src/app/**/layout.tsx`.
2. **Server vs. Client Components:**
   - Keep Server Components as the default for superior performance, SEO, and zero client JS.
   - Use `'use client'` only on components that need state, hooks (`useState`, `useEffect`), or user interactions.
3. **Styling & Design Tokens:**
   - Tailwind CSS v4 design tokens are mapped to luxury jewellery variables in `src/app/globals.css`.
   - Use `var(--accent-gold)`, `var(--bg-main)`, `var(--bg-card)`, etc. to ensure dark/light mode compatibility.
4. **Price Representation:**
   - In databases, APIs, and calculators: Always compute in **paise** (integer).
   - Only format into Rupee strings (`₹1,45,000`) at the display layer using standard Indian number formatting (`en-IN`).
