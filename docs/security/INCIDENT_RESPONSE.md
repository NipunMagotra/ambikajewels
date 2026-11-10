# SECURITY INCIDENT RESPONSE PLAYBOOK

> **Authoritative Playbook:** [SECURITY_INCIDENT_RESPONSE.md](file:///d:/Client%20Projects/Ambika%20Jewels/handover/technical/SECURITY_INCIDENT_RESPONSE.md)

This document provides immediate, actionable procedures for responding to security events in production.

### Fast Response Triggers & Triage:
- **Severity 1 (Critical):** Active payment tampering, unauthorized admin account creation, compromised service-role secret.
  - *Immediate Action:* Put storefront in maintenance mode (`siteConfig.features.maintenanceMode = true`), revoke all admin sessions, rotate Razorpay/Supabase secrets in Netlify.
- **Severity 2 (High):** Multiple failed payment webhook signatures, brute force against admin login, failed bullion sanity check.
  - *Immediate Action:* Check IP blocklist in rate limiter, review audit logs for affected accounts.
- **Severity 3 (Medium):** Out-of-sync inventory count, delayed courier webhook.

Please refer to the full step-by-step incident response playbook:  
👉 **[SECURITY_INCIDENT_RESPONSE.md](file:///d:/Client%20Projects/Ambika%20Jewels/handover/technical/SECURITY_INCIDENT_RESPONSE.md)**
