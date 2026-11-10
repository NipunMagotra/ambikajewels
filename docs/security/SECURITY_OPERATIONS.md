# SECURITY OPERATIONS & KEY ROTATION PROTOCOL

> **Primary Operational Manual:** [SECURITY_OPERATIONS_GUIDE.md](file:///d:/Client%20Projects/Ambika%20Jewels/handover/technical/SECURITY_OPERATIONS_GUIDE.md)

This document links to the comprehensive security operations playbook maintained for the production environment.

### Summary of Ongoing Security Operations:
1. **Quarterly Key Rotation:** Rotating Razorpay API secrets, Supabase Service Role keys, and Admin Session Secrets.
2. **Staff Lifecycle Management:** Instant account deactivation and persistent session revocation upon staff departure.
3. **Audit Log Inspection:** Weekly review of the tamper-evident administrative audit log in `/admin` for unusual rate changes, bulk product updates, or coupon creations.
4. **Log Sanitization:** Automated verification that secrets, PAN numbers, and customer credit card tokens are never written to application logs.

Please refer to the authoritative guide:  
👉 **[SECURITY_OPERATIONS_GUIDE.md](file:///d:/Client%20Projects/Ambika%20Jewels/handover/technical/SECURITY_OPERATIONS_GUIDE.md)**
