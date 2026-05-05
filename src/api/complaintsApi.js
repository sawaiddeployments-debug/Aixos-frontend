import { supabase } from '../supabaseClient';

const BOT_FALLBACK_MESSAGE = 'AI is currently unavailable, please try again.';
const ADMIN_IDLE_MINUTES = 5;

const minutesAgoIso = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const normalizeId = (value) => (value == null ? '' : String(value).trim());

export const getComplaintMessages = async (userId) => {
    const normalizedUserId = normalizeId(userId);
    console.log('[ComplaintAPI] getComplaintMessages → userId:', normalizedUserId);
    if (!normalizedUserId) return [];

    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', normalizedUserId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    console.log('[ComplaintAPI] Fetched', data?.length, 'messages →', data?.map(m => ({
        id: m.id,
        is_admin: m.is_admin,
        is_bot: m.is_bot,
        preview: m.message?.slice(0, 40),
    })));
    return data || [];
};

export const getComplaintThreads = async () => {
    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

    if (error) throw error;

    const map = new Map();
    (data || []).forEach((row) => {
        if (!map.has(row.user_id)) {
            map.set(row.user_id, {
                userId: row.user_id,
                userRole: row.user_role,
                lastMessage: row.message,
                createdAt: row.created_at,
                status: row.status || 'open',
                unreadCount: 0
            });
        }
        if (!row.is_admin && !row.is_read) {
            map.get(row.user_id).unreadCount += 1;
        }
    });

    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const isAnyAdminActive = async () => {
    const cutoff = minutesAgoIso(ADMIN_IDLE_MINUTES);
    const { data, error } = await supabase
        .from('admin_presence')
        .select('admin_id')
        .eq('is_active', true)
        .gte('last_seen_at', cutoff)
        .limit(1);

    if (error) return false;
    return Boolean(data?.length);
};

const hasRecentHumanAdminReply = async (userId) => {
    const cutoff = minutesAgoIso(ADMIN_IDLE_MINUTES);
    let query = supabase
        .from('complaints')
        .select('id')
        .eq('is_admin', true)
        .eq('is_bot', false)
        .gte('created_at', cutoff)
        .limit(1);

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) return false;
    return Boolean(data?.length);
};

const insertComplaintMessage = async (payload) => {
    const { data, error } = await supabase
        .from('complaints')
        .insert(payload)
        .select('*')
        .single();

    if (error) throw error;
    return data;
};

export const sendUserComplaint = async ({ userId, userRole, message }) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId) {
        throw new Error('Missing user id for complaint thread');
    }

    const payload = {
        user_id: normalizedUserId,
        user_role: userRole,
        message: message.trim(),
        is_admin: false,
        is_bot: false,
    };
    console.log('[ComplaintAPI] Saving user message →', payload);
    return insertComplaintMessage(payload);
};

export const checkAdminAvailable = async (userId) => {
    const adminActive = await isAnyAdminActive();
    const recentReply = await hasRecentHumanAdminReply(userId);
    const available = adminActive || recentReply;
    console.log('[ComplaintAI] Admin available check →', { adminActive, recentReply, available });
    return available;
};

export const sendBotComplaintReply = async ({ userId, userRole, message }) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId) return;

    const botMessage = message?.trim() || BOT_FALLBACK_MESSAGE;
    const payload = {
        user_id: normalizedUserId,
        user_role: userRole,
        message: botMessage,
        is_admin: true,
        is_bot: true,
    };
    console.log('[ComplaintAPI] Saving AI bot reply →', payload);
    return insertComplaintMessage(payload);
};

export const sendAdminComplaintReply = async ({ userId, userRole, message }) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId) {
        throw new Error('Missing complaint user id for admin reply');
    }

    return insertComplaintMessage({
        user_id: normalizedUserId,
        user_role: userRole,
        message: message.trim(),
        is_admin: true,
        is_bot: false
    });
};

export const markThreadMessagesAsRead = async ({ userId, readAdminMessages }) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId) return;

    const { error } = await supabase
        .from('complaints')
        .update({ is_read: true })
        .eq('user_id', normalizedUserId)
        .eq('is_read', false)
        .eq('is_admin', readAdminMessages);

    if (error) throw error;
};

export const getComplaintUnreadCountForAdmin = async () => {
    const { count, error } = await supabase
        .from('complaints')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', false)
        .eq('is_read', false);

    if (error) throw error;
    return count || 0;
};

export const getComplaintUnreadCountForUser = async (userId) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId) return 0;

    const { count, error } = await supabase
        .from('complaints')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', normalizedUserId)
        .eq('is_admin', true)
        .eq('is_read', false);

    if (error) throw error;
    return count || 0;
};

