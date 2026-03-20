import React, { useState } from 'react';
import {
    Layout, Clock, MessageSquare,
    DollarSign, Users, Bell,
    Search, Filter, Plus, ChevronRight,
    CheckCircle2
} from 'lucide-react';

// Sub-components
import ValidationTab from './components/ValidationTab';
import MaintenanceTab from './components/MaintenanceTab';
import RefilledTab from './components/RefilledTab';
import NewUnitTab from './components/NewUnitTab';

// Dummy Data
import {
    validationInquiries,
    maintenanceInquiries,
    refilledInquiries,
    newUnitInquiries
} from '../../data/partnerDummyData';

const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
        <div className="relative z-10">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight">{value}</h3>
            {subtitle && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
    </div>
);

const PartnerDashboard = () => {
    const [filterType, setFilterType] = useState('All');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [stats] = useState({
        activeInquiries: 12,
        pendingInquiries: 5,
        closedInquiries: 142,
        totalSales: 12500,
        totalAgents: 8
    });

    // Consolidate all inquiries from data sources
    const allInquiries = [
        ...validationInquiries.map(inq => ({
            ...inq,
            inquiryType: 'Validation',
            displayId: inq.id,
            displayClient: inq.clientName,
            originalData: inq
        })),
        ...maintenanceInquiries.map(inq => ({
            ...inq,
            inquiryType: 'Maintenance',
            displayId: inq.inquiryNo || inq.id,
            displayClient: inq.customerName,
            originalData: inq
        })),
        ...refilledInquiries.map(inq => ({
            ...inq,
            inquiryType: 'Refilled',
            displayId: inq.inquiryNo || inq.id,
            displayClient: inq.customerName,
            originalData: inq
        })),
        ...newUnitInquiries.map(inq => ({
            ...inq,
            inquiryType: 'New Unit',
            displayId: inq.inquiryNo || inq.id,
            displayClient: inq.customer,
            originalData: inq
        }))
    ];

    const filteredInquiries = filterType === 'All'
        ? allInquiries
        : allInquiries.filter(inq => inq.inquiryType === filterType);

    const renderDetailView = () => {
        if (!selectedInquiry) return null;

        const { inquiryType, originalData } = selectedInquiry;

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => setSelectedInquiry(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors mb-6 font-bold text-sm"
                >
                    <ChevronRight size={18} className="rotate-180" /> Back to Global List
                </button>

                {inquiryType === 'Validation' && <ValidationTab data={[originalData]} initialInquiry={originalData} />}
                {inquiryType === 'Maintenance' && <MaintenanceTab data={[originalData]} initialInquiry={originalData} />}
                {inquiryType === 'Refilled' && <RefilledTab data={[originalData]} initialInquiry={originalData} />}
                {inquiryType === 'New Unit' && <NewUnitTab data={[originalData]} initialInquiry={originalData} />}
            </div>
        );
    };

    if (selectedInquiry) {
        return (
            <div className="min-h-screen pb-20 animate-in fade-in duration-700">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft-xl overflow-hidden p-8">
                    {renderDetailView()}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 animate-in slide-in-from-bottom-6 duration-700 delay-100">
                <StatCard icon={Layout} title="Total Active" value={stats.activeInquiries} color="bg-primary-500" subtitle="Inquiries" />
                <StatCard icon={Clock} title="Total Pending" value={stats.pendingInquiries} color="bg-amber-500" subtitle="Awaiting Action" />
                <StatCard icon={CheckCircle2} title="Total Closed" value={stats.closedInquiries} color="bg-emerald-500" subtitle="Past 30 Days" />
                <StatCard icon={DollarSign} title="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} color="bg-indigo-500" subtitle="Gross Profit" />
                <StatCard icon={Users} title="Total Agents" value={stats.totalAgents} color="bg-pink-500" subtitle="Active Field Teams" />
            </div>

            {/* Main Application Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                            All <span className="text-primary-500">Inquiries.</span>
                        </h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Showing {filteredInquiries.length} results
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" size={16} />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="pl-12 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="Validation">Validation</option>
                                <option value="Refilled">Refilled</option>
                                <option value="New Unit">New Unit</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Plus size={14} className="rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-8 py-6">Inquiry No</th>
                                    <th className="px-8 py-6">Client Name</th>
                                    <th className="px-8 py-6">Inquiry Type</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredInquiries.map((inq, idx) => (
                                    <tr key={`${inq.inquiryType}-${inq.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6 font-black text-primary-600 text-sm tracking-tighter">
                                            {inq.displayId}
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-900">{inq.displayClient}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${inq.inquiryType === 'Validation' ? 'bg-blue-50 text-blue-600' :
                                                    inq.inquiryType === 'Refilled' ? 'bg-purple-50 text-purple-600' :
                                                        inq.inquiryType === 'New Unit' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {inq.inquiryType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${inq.status === 'Active' || inq.status === 'Completed' || inq.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedInquiry(inq)}
                                                className="px-6 py-2 bg-slate-900 text-white hover:bg-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 hover:shadow-primary"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;

