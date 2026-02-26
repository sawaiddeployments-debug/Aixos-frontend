import client from './client';

export const getPartnerDashboard = async () => {
    try {
        const response = await client.get('/partners/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching partner dashboard:', error);
        throw error;
    }
};
