import React from 'react';
import ComplaintChat from '../../components/Chat/ComplaintChat';
import { useAuth } from '../../context/AuthContext';

const ComplaintPage = () => {
    const { user } = useAuth();
    let parsedUser = null;
    try {
        const storedUser = localStorage.getItem('user');
        parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        parsedUser = null;
    }
    const userId = [
        user?.id,
        user?.user_id,
        parsedUser?.id,
        parsedUser?.user_id,
        parsedUser?.agent_id,
        parsedUser?.partner_id,
        parsedUser?.customer_id
    ]
        .map((value) => (value == null ? '' : String(value).trim()))
        .find(Boolean);
    const userRole = user?.role || localStorage.getItem('role') || 'customer';

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Complaint</h1>
                <p className="text-slate-500">Share your issue and chat directly with admin support.</p>
            </div>
            <ComplaintChat userId={userId} userRole={userRole} />
        </div>
    );
};

export default ComplaintPage;

