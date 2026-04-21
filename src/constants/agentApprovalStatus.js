import { supabase } from '../supabaseClient';

/** Canonical values stored in agents.status (see supabase migration). */
export const AGENT_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  HOLD: 'hold',
};

export function agentLoginBlockedMessage(status) {
  const s = (status || '').toLowerCase();
  if (s === AGENT_STATUS.PENDING) return 'Your account is not approved yet';
  if (s === AGENT_STATUS.REJECTED) return 'Your account is rejected';
  if (s === AGENT_STATUS.HOLD) return 'Your account is on hold. Contact admin';
  return 'Your account is not approved yet';
}

/** Used after API login and on session restore (mirrors SELECT status FROM agents WHERE …). */
export async function fetchAgentApprovalStatus({ id, email }) {
  if (id) {
    const { data, error } = await supabase.from('agents').select('status').eq('id', id).maybeSingle();
    if (error) console.error('Agent status lookup by id failed:', error);
    else if (data) return data.status;
  }
  if (email) {
    const { data, error } = await supabase
      .from('agents')
      .select('status')
      .eq('email', email.trim())
      .maybeSingle();
    if (error) console.error('Agent status lookup by email failed:', error);
    else if (data) return data.status;
  }
  return null;
}
