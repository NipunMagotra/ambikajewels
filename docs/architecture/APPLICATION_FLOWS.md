# CRITICAL APPLICATION FLOWS

---

## 1. Secure Customer Checkout & Payment Capture Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Browser)
    participant UI as Checkout Page
    participant Server as /api/razorpay/create-order
    participant DB as Supabase DB
    participant Engine as Inventory Engine
    participant RZP as Razorpay Gateway
    participant Verify as /api/razorpay/verify

    Customer->>UI: Clicks "Proceed to Payment"
    UI->>Server: POST items & shipping address
    Server->>DB: Fetch authoritative catalog prices & stock
    Server->>Engine: Reserve inventory items (15-min TTL)
    alt Out of Stock or Reserved
        Engine-->>Server: Error: Item unavailable
        Server-->>UI: Halt with out-of-stock alert
    else Stock Available
        Server->>Server: Calculate Subtotal, 3% GST & Shipping
        Server->>RZP: orders.create({ amount: calculatedPaise })
        RZP-->>Server: Returns razorpay_order_id
        Server-->>UI: Returns razorpay_order_id & amount
        UI->>Customer: Opens Razorpay Checkout Modal (UPI/Cards)
        Customer->>RZP: Completes banking payment
        RZP-->>UI: Returns razorpay_payment_id & signature
        UI->>Verify: POST payment signature & order details
        Verify->>Verify: HMAC-SHA256(order_id + "|" + payment_id, SECRET)
        alt Signature Matches
            Verify->>DB: Update order status to 'paid'
            Verify->>Engine: Commit inventory reservation permanently
            Verify-->>UI: HTTP 200 { success: true, order_number }
            UI->>Customer: Redirect to /order-status (Invoice & Tracking)
        else Forged or Tampered Signature
            Verify-->>UI: HTTP 400 Bad Request
            UI->>Customer: Payment Verification Failed Alert
        end
    end
```

---

## 2. Asynchronous Webhook Reconciliation Flow (Browser Drop-Off Defense)

```mermaid
sequenceDiagram
    autonumber
    participant RZP as Razorpay Servers
    participant Webhook as /api/razorpay/webhook
    participant DB as Supabase Database

    Note over RZP,Webhook: Customer closes browser before redirect completes
    RZP->>Webhook: POST event: 'order.paid' with X-Razorpay-Signature
    Webhook->>Webhook: Verify HMAC-SHA256 with RAZORPAY_WEBHOOK_SECRET
    alt Signature Valid
        Webhook->>DB: Check if order already marked 'paid' (Idempotency)
        alt Already Paid
            Webhook-->>RZP: HTTP 200 (Already Processed)
        else Pending Confirmation
            Webhook->>DB: Verify paid amount matches order total exactly
            alt Amount Matches
                Webhook->>DB: Mark order 'paid' & commit inventory
                Webhook-->>RZP: HTTP 200 OK
            else Amount Mismatch
                Webhook->>DB: Flag order for manual audit (Potential Tampering)
                Webhook-->>RZP: HTTP 200 (Alert Recorded)
            end
        end
    else Invalid Signature
        Webhook-->>RZP: HTTP 400 Bad Request
    end
```

---

## 3. Zero-Trust Admin Authentication & MFA Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Staff / Owner
    participant Login as /admin/login
    participant AuthAPI as /api/admin/login
    participant StaffDB as staff_accounts Table
    participant Edge as Edge Middleware

    Admin->>Login: Enter individual email & master password
    Login->>AuthAPI: POST credentials
    AuthAPI->>StaffDB: Query account by email
    AuthAPI->>AuthAPI: Verify PBKDF2-SHA512 password hash
    alt Credentials Valid
        alt Role == 'owner'
            AuthAPI-->>Login: HTTP 200 { requiresMfa: true, tempToken }
            Admin->>Login: Enter 6-digit TOTP code from Authenticator App
            Login->>AuthAPI: POST { tempToken, totpCode }
            AuthAPI->>AuthAPI: Verify TOTP RFC 6238 counter
        end
        AuthAPI->>AuthAPI: Issue signed HMAC session token (12-hour TTL)
        AuthAPI-->>Login: Set httpOnly cookie 'ambika_admin_session'
        Login->>Admin: Redirect to /admin visual dashboard
    else Invalid Credentials
        AuthAPI->>StaffDB: Increment failed_attempts (Lock if >= 5)
        AuthAPI-->>Login: HTTP 401 Unauthorized
    end
```
