import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, Layout, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { getPartnerDashboard } from '../../api/partners';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';

const PartnerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUnits: 0,
        refillsNeeded: 0,
        activeQueries: 0
    });
    const [assignedUnits, setAssignedUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const data = await getPartnerDashboard();
                setAssignedUnits(data.assignedUnits || []);
                setStats(data.stats);
            } catch (err) {
                console.error('Error fetching partner dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) return <PageLoader message="Loading partner dashboard..." />;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Partner Dashboard</h1>
                    <p className="text-slate-500">Overview of your assigned extinguishers and service requests.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
                    <div className="p-3 rounded-2xl bg-blue-500 w-fit mb-4">
                        <Package size={24} className="text-white" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Assigned Units</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats.totalUnits}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
                    <div className="p-3 rounded-2xl bg-emerald-500 w-fit mb-4">
                        <Layout size={24} className="text-white" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Refilling/Maintained</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats.refillsNeeded}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
                    <div className="p-3 rounded-2xl bg-purple-500 w-fit mb-4">
                        <MessageSquare size={24} className="text-white" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Active Queries</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stats.activeQueries}</h3>
                </div>
            </div>

            {assignedUnits.length > 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Recently Assigned Units</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                                    <th className="px-6 py-4">Unit Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Condition</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {assignedUnits.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{unit.type} ({unit.capacity})</p>
                                                    <p className="text-xs text-slate-500">Qty: {unit.quantity}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-700">{unit.customers?.business_name}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{unit.customers?.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${unit.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                unit.status === 'Refilled' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                {unit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${unit.condition === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                <span className="text-sm text-slate-600">{unit.condition}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary-600 transition-all">
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 shadow-xl text-white relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 className="text-2xl font-bold mb-4 relative z-10">No Units Assigned Yet</h3>
                    <p className="text-slate-300 max-w-lg mx-auto relative z-10">
                        When agents log visits and assign extinguishers to your business for maintenance or refilling, they will appear here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PartnerDashboard;
