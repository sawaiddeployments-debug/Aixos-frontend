import client from './client';

export const getMessages = async (extinguisherId) => {
    try {
        const response = await client.get(`/extinguishers/${extinguisherId}/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

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
