import client from './client';
import { supabase } from '../supabaseClient';

/**
 * Fetch chat history for a specific extinguisher
 * GET /api/extinguishers/:id/messages
 */
export const getMessages = async (extinguisherId) => {
    try {
        const response = await client.get(`/extinguishers/${extinguisherId}/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

/**
 * Send a new message
 * POST /api/extinguishers/:id/messages
 */
export const sendMessage = async (extinguisherId, content) => {
    try {
        const response = await client.post(`/extinguishers/${extinguisherId}/messages`, {
            content,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Direct Message APIs (General Customer <-> Partner chat)
 */
export const getDirectMessagesHistory = async (senderId, receiverId, inquiryId = '') => {
    console.group('💬 CHAT API: FETCHING HISTORY');
    console.log('Sender ID:', senderId);
    console.log('Receiver ID:', receiverId);
    console.log('Inquiry ID:', inquiryId);
    console.groupEnd();
    
    try {
        const response = await client.get('/messages', {
            params: { sender_id: senderId, receiver_id: receiverId, inquiry_id: inquiryId }
        });
        console.log('✅ HISTORY FETCHED:', response.data?.data?.length || 0, 'messages found.');
        return response.data?.data || [];
    } catch (error) {
        console.error('❌ HISTORY FETCH ERROR:', error);
        throw error;
    }
};

/**
 * Send a direct message and trigger a notification for the recipient.
 */
export const sendDirectMessage = async (senderId, receiverId, inquiryId, content, senderRole = 'partner', extinguisherId = null) => {
    console.group('💬 CHAT API: SENDING MESSAGE');
    console.log('Sender ID:', senderId);
    console.log('Recipient ID:', receiverId);
    console.log('Inquiry ID:', inquiryId);
    console.log('Extinguisher ID:', extinguisherId);
    console.log('Content:', content);
    console.log('Sender Role:', senderRole);
    console.groupEnd();

    try {
        // 1. Send the message via API (Backend expects 'message' instead of 'content')
        const response = await client.post('/messages', {
            sender_id: senderId,
            receiver_id: receiverId,
            inquiry_id: inquiryId,
            extinguisher_id: extinguisherId,
            message: content
        });

        console.log('✅ API RESPONSE:', response.data);

        // 2. Trigger notification in Supabase
        if (response.data?.success || response.data?.data) {
            try {
                console.log('🔔 TRIGGERING NOTIFICATION FOR:', receiverId);
                const { data: notifData, error: notifErr } = await supabase.from('notifications').insert({
                    sender_id: senderId,
                    sender_role: senderRole,
                    recipient_id: String(receiverId), // Ensure it's text for UUIDs/int4 logic
                    recipient_role: senderRole === 'partner' ? 'customer' : 'partner',
                    inquiry_id: inquiryId,
                    message: `New message received from ${senderRole.charAt(0).toUpperCase() + senderRole.slice(1)}`,
                    is_read: false
                });
                
                if (notifErr) {
                    console.error('⚠️ NOTIFICATION INSERT ERROR:', notifErr);
                } else {
                    console.log('✅ NOTIFICATION TRIGGERED SUCCESSFULLY');
                }
            } catch (notifErr) {
                console.error('❌ FAILED TO TRIGGER NOTIFICATION:', notifErr);
            }
        }

        return response.data?.data;
    } catch (error) {
        console.error('❌ SEND MESSAGE ERROR:', error);
        throw error;
    }
};

export const updateDirectMessageStatus = async (messageId, status) => {
    console.log('🔄 UPDATING MESSAGE STATUS:', messageId, '->', status);
    try {
        const response = await client.patch('/messages/status', {
            message_id: messageId,
            status
        });
        return response.data?.data;
    } catch (error) {
        console.error('❌ STATUS UPDATE ERROR:', error);
        throw error;
    }
};

/**
 * Bulk update message status for a specific conversation
 */
export const markMessagesAsRead = async (messageIds) => {
    if (!messageIds || messageIds.length === 0) return;
    try {
        const promises = messageIds.map(id => updateDirectMessageStatus(id, 'read'));
        await Promise.all(promises);
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
};
