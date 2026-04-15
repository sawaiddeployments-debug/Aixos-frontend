import React, { useState, useEffect } from 'react';
import { UserPlus, X, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { getAllPartners } from '../../../api/partners';

const SwitchPartnerModal = ({ isOpen, onClose, onSwitch, loading, currentPartnerId }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartnerId, setSelectedPartnerId] = useState('');
    const [reason, setReason] = useState('');
    const [fetching, setFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchPartners = async () => {
                setFetching(true);
                try {
                    const data = await getAllPartners();
                    // Filter out current partner
                    setPartners(data.filter(p => p.id !== currentPartnerId));
                } catch (err) {
                    console.error('Failed to fetch partners:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchPartners();
        }
    }, [isOpen, currentPartnerId]);

    if (!isOpen) return null;

    const filteredPartners = partners.filter(p => 
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.business_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSwitch({ new_partner_id: selectedPartnerId, reason });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Switch Partner</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Reassign Inquiry</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select New Partner</label>
                            
                            <div className="relative mb-2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search partners..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                            </div>

                            <select
                                required
                                value={selectedPartnerId}
                                onChange={(e) => setSelectedPartnerId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="">Choose a partner...</option>
                                {fetching ? (
                                    <option disabled>Loading partners...</option>
                                ) : (
                                    filteredPartners.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.business_name || p.name} ({p.name})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Switching</label>
                            <textarea
                                required
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why you are switching partners..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex gap-3">
                        <AlertTriangle className="text-rose-500 shrink-0" size={20} />
                        <p className="text-[10px] text-rose-700 font-bold leading-relaxed">
                            Warning: Switching partners will reset the inquiry status to 'Pending' for the new partner. The old partner will be notified of this change and the reason provided.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedPartnerId}
                            className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CheckCircle2 size={18} />
                            )}
                            Confirm Switch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SwitchPartnerModal;
