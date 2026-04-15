import { supabase } from '../supabaseClient';

/**
 * Sticker balance (partners.stickers_total) and usage count from sticker history.
 * Expects logged-in partner's `user.id` to match `partners.id` (same pattern as agent visits).
 */
export async function fetchPartnerStickerSummary(partnerId) {
  if (!partnerId) {
    return { stickersRemaining: 0, stickersUsed: 0, stickersAllocated: 0 };
  }

  const { data: partner, error: partnerError } = await supabase
    .from('partners')
    .select('stickers_total')
    .eq('id', partnerId)
    .maybeSingle();

  if (partnerError) {
    console.error('fetchPartnerStickerSummary partner row:', partnerError);
  }

  const { data: usedRows, error: usedError } = await supabase
    .from('sticker_usage_history')
    .select('quantity')
    .eq('partner_id', partnerId);

  if (usedError) {
    console.error('fetchPartnerStickerSummary used count:', usedError);
  }

  const stickersUsed = Array.isArray(usedRows)
    ? usedRows.reduce((sum, r) => sum + (Number(r?.quantity ?? 0) || 0), 0)
    : 0;
  const stickersRemaining = Number(partner?.stickers_total ?? 0) || 0;
  const stickersAllocated = stickersUsed + stickersRemaining;

  return {
    stickersRemaining,
    stickersUsed,
    stickersAllocated,
  };
}

const STICKER_LOG_SELECT = `
  id,
  partner_id,
  inquiry_id,
  used_for,
  quantity,
  created_at,
  inquiries (
    id,
    inquiry_no,
    type,
    customers ( business_name )
  )
`;

export async function fetchPartnerStickerUsageLogs(partnerId) {
  if (!partnerId) {
    return [];
  }

  const { data, error } = await supabase
    .from('sticker_usage_history')
    .select(STICKER_LOG_SELECT)
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchPartnerStickerUsageLogs:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/** @param {string} serviceType db value: validation | refilled */
export function formatStickerServiceLabel(serviceType) {
  const s = (serviceType || '').toLowerCase();
  if (s === 'validation') return 'Validation';
  if (s === 'refilled') return 'Refilled';
  return serviceType || '—';
}

export function stickerLogRowDisplay(row) {
  const inquiry = row?.inquiries;
  const customerName = inquiry?.customers?.business_name ?? '—';
  const inquiryNo = inquiry?.inquiry_no ?? inquiry?.id ?? row?.inquiry_id ?? '—';
  return {
    id: row.id,
    customerName,
    serviceLabel: formatStickerServiceLabel(row.used_for || inquiry?.type),
    inquiryDisplay: inquiryNo,
    quantity: Number(row?.quantity ?? 1) || 1,
    usedAt: row.created_at,
    service_type: (row.used_for || '').toLowerCase(),
  };
}
