export interface AuditLogEntry {
  id: string;
  staff_email: string;
  staff_name: string;
  action: string;
  entity_type: 'product' | 'order' | 'rates' | 'coupon' | 'store_content' | 'auth' | 'inventory';
  entity_id?: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  ip_address?: string;
  created_at: string;
}

// In-memory ring buffer (up to 200 entries) ensuring audit history is accessible even if DB table is initializing
const memoryAuditLogs: AuditLogEntry[] = [];
const MAX_MEMORY_LOGS = 200;

export async function recordAuditLog(entry: {
  staffEmail?: string;
  staffName?: string;
  action: string;
  entityType: 'product' | 'order' | 'rates' | 'coupon' | 'store_content' | 'auth' | 'inventory';
  entityId?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  request?: Request;
}): Promise<AuditLogEntry> {
  let ipAddress = '127.0.0.1';
  if (entry.request) {
    const forwarded = entry.request.headers.get('x-forwarded-for');
    ipAddress = forwarded ? forwarded.split(',')[0].trim() : (entry.request.headers.get('x-real-ip') || '127.0.0.1');
  }

  const logRecord: AuditLogEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    staff_email: entry.staffEmail || 'owner@ambikajewels.com',
    staff_name: entry.staffName || 'Store Owner',
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    old_values: entry.oldValues || null,
    new_values: entry.newValues || null,
    ip_address: ipAddress,
    created_at: new Date().toISOString()
  };

  // 1. Always keep in local memory buffer
  memoryAuditLogs.unshift(logRecord);
  if (memoryAuditLogs.length > MAX_MEMORY_LOGS) {
    memoryAuditLogs.pop();
  }

  // 2. Persist to Supabase if configured
  try {
    const { supabaseAdmin, isSupabaseAdminConfigured } = await import('./supabaseAdmin');
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin.from('admin_audit_logs').insert({
        staff_email: logRecord.staff_email,
        staff_name: logRecord.staff_name,
        action: logRecord.action,
        entity_type: logRecord.entity_type,
        entity_id: logRecord.entity_id,
        old_values: logRecord.old_values,
        new_values: logRecord.new_values,
        ip_address: logRecord.ip_address,
        created_at: logRecord.created_at
      });
    }
  } catch {
    // Gracefully silent on DB audit log insert error so primary mutation does not fail
  }

  return logRecord;
}

export async function getRecentAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  try {
    const { supabaseAdmin, isSupabaseAdminConfigured } = await import('./supabaseAdmin');
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as AuditLogEntry[];
      }
    }
  } catch {
    // Fallback to memory
  }

  return memoryAuditLogs.slice(0, limit);
}

