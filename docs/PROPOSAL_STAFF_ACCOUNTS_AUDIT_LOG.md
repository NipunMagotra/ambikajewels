# Architecture Proposal: Per-Staff Admin Accounts & Tamper-Evident Audit Logging

> **Document Status:** PROPOSAL ONLY (Phase 3 Item 8)  
> **Prepared For:** Ambika Jewels Management & Technical Audit  
> **Target Migration:** [`supabase/migrations/proposal_staff_accounts_and_audit_log.sql`](file:///d:/Client%20Projects/Ambika%20Jewels/supabase/migrations/proposal_staff_accounts_and_audit_log.sql)  
> **Current Baseline:** Single shared `ADMIN_PASSCODE` with 12-hour HMAC signed session cookie.

---

## 1. Problem Statement & Motivation
Currently, all administrative functions (updating daily 22K/18K gold and silver bullion rates, viewing incoming orders, generating POS receipts, and modifying catalog parameters) rely on a single shared administrative secret.

**Vulnerabilities in Shared Credentials:**
1. **Lack of Non-Repudiation:** If an unauthorized or mistaken rate change occurs (e.g., gold rate accidentally typed as ₹6,000 instead of ₹7,800), there is no record of which staff member initiated the modification.
2. **Accountability for Order Status:** Order fulfillment milestones (e.g. marking paid, dispatching with BVC Logistics, or cancelling an order) cannot be attributed to a specific counter employee.
3. **No Rollback Diff History:** Previous metal rates or product prices are overwritten without preserving an automated JSON diff of what changed.

---

## 2. Architectural Design

```
+---------------------------------------------------------------------------------+
|                                 STAFF CLIENT                                    |
|   (Owner: Shivani Anand / Representative: Lakesh Kumar / Counter Cashiers)      |
+---------------------------------------------------------------------------------+
                                      |
                                      | Login with Email & Passcode / Magic OTP
                                      v
+---------------------------------------------------------------------------------+
|                       /api/admin/auth/login ROUTE                               |
|   1. Verifies staff credentials against public.staff_accounts                   |
|   2. Issues HMAC-SHA256 Token: staffId:email:role:expiry:signature              |
|   3. Sets HttpOnly, Secure, SameSite=Strict cookie                              |
+---------------------------------------------------------------------------------+
                                      |
       +------------------------------+------------------------------+
       |                              |                              |
       v                              v                              v
POST /api/admin/rates          POST /api/admin/products       POST /api/admin/orders
- Checks RBAC Permissions      - Checks RBAC Permissions      - Checks RBAC Permissions
- Computes Delta & Sanity      - Captures Old vs New Price    - Updates Order Status
       |                              |                              |
       +------------------------------+------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                          AUDIT LOG INTERCEPTOR                                  |
|   Writes to public.admin_audit_logs via Supabase service_role key:             |
|   {                                                                             |
|     staff_id: "uuid-...",                                                       |
|     staff_name: "Lakesh Kumar",                                                 |
|     action: "UPDATE_DAILY_RATES",                                               |
|     entity_type: "rates",                                                       |
|     old_values: { gold_22k: 7850 },                                             |
|     new_values: { gold_22k: 7920 },                                             |
|     ip_address: "103.xxx.xxx.xxx",                                              |
|     timestamp: "2026-10-01T..."                                                 |
|   }                                                                             |
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                     IMMUTABLE SUPABASE AUDIT STORAGE                            |
|   - Row-Level Security: Only INSERT allowed (Revoked UPDATE & DELETE)           |
|   - Zero anonymous read access                                                  |
|   - Complete audit trail preserved indefinitely for statutory compliance        |
+---------------------------------------------------------------------------------+
```

---

## 3. Role-Based Access Control (RBAC) Matrix

| Action / Endpoint | Owner (`owner`) | Manager (`manager`) | Cashier (`cashier`) | Goldsmith (`goldsmith`) |
| :--- | :---: | :---: | :---: | :---: |
| **Update Daily Bullion Rates** (`/api/admin/rates`) | ✅ Full Access | ✅ Full Access | ❌ Read Only | ❌ Read Only |
| **Bypass Rate Sanity Deviation (>5%)** | ✅ Allowed | ❌ Requires Owner | ❌ Blocked | ❌ Blocked |
| **Catalog Price & Weight Edits** | ✅ Full Access | ✅ Full Access | ❌ Blocked | ❌ Blocked |
| **Counter POS Billing & Receipts** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ❌ Blocked |
| **Order Tracking & BVC Dispatch** | ✅ Full Access | ✅ Full Access | ✅ View Only | ❌ Blocked |
| **Process Payment Refunds / Cancellations** | ✅ Full Access | ❌ Requires Owner | ❌ Blocked | ❌ Blocked |
| **View Audit Trail Logs** | ✅ Full Access | ❌ Blocked | ❌ Blocked | ❌ Blocked |

---

## 4. Implementation Details

### 4.1. Cryptographic Token Structure
In [`src/lib/adminAuth.ts`](file:///d:/Client%20Projects/Ambika%20Jewels/src/lib/adminAuth.ts), update the session token format to encode staff metadata:
```typescript
interface StaffSession {
  staffId: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier' | 'accountant';
  expiresAt: number;
}

// Token payload format:
// base64(JSON.stringify(sessionPayload)) + "." + HMAC_SHA256(payload, ADMIN_SESSION_SECRET)
```

### 4.2. Audit Logging Utility
```typescript
export async function logAdminAction(params: {
  staff: StaffSession;
  action: string;
  entityType: 'rates' | 'products' | 'orders' | 'auth';
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  request: Request;
}): Promise<void> {
  const ip = params.request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const userAgent = params.request.headers.get('user-agent') || 'unknown';

  await supabaseAdmin.from('admin_audit_logs').insert({
    staff_id: params.staff.staffId,
    staff_email: params.staff.email,
    staff_name: params.staff.name,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    old_values: params.oldValues,
    new_values: params.newValues,
    ip_address: ip,
    user_agent: userAgent,
  });
}
```

---

## 5. Security & Legal Metrology Compliance
1. **Append-Only Immutability:** In SQL, `REVOKE UPDATE, DELETE ON public.admin_audit_logs FROM PUBLIC, anon, authenticated;`. Once an audit record is written, neither staff nor database administrators can tamper with or erase past rate modifications.
2. **DPDP Compliance:** Customer PII (phone numbers, full card numbers) is never captured in `old_values` or `new_values`.
3. **Statutory 8-Year Audit Trail:** Preserved alongside GST records to demonstrate compliance with legal metrology and income tax authorities.
