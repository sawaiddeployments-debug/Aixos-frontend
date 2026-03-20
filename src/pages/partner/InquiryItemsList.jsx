import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, MessageCircle, Building2, Calendar } from 'lucide-react';
import { newUnitInquiries } from '../../data/partnerDummyData';
import NewUnitDetailModal from './components/NewUnitDetailModal';

const InquiryItemsList = () => {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const found = newUnitInquiries.find(inq => inq.id === id);
        setInquiry(found);
    }, [id]);

    if (!inquiry) return (
        <div className="p-12 text-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest">Inquiry not found</p>
            <Link to="/partner/dashboard" className="text-primary-500 font-bold mt-4 inline-block underline">Back to Dashboard</Link>
        </div>
    );

    const handleViewItem = (item) => {
        // We pass the parent inquiry context but filter it to this specific item for the modal
        setSelectedItem({
            ...inquiry,
            selectedItem: item, // Add hint for modal which item is targeted
            quantity: item.quantity,
            unitType: item.product
        });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-10 pt-4 flex items-center justify-between">
                <div>
                    <Link to="/partner/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
                        <ArrowLeft size={16} /> Back to Inquiries
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter uppercase italic">
                        Inquiry <span className="text-primary-500">Items.</span>
                    </h1>
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600 font-bold text-xs uppercase tracking-wider">
                            <Building2 size={14} className="text-primary-500" /> {inquiry.customer}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-600 font-bold text-xs uppercase tracking-wider">
                            <Package size={14} className="text-primary-500" /> {inquiry.inquiryNo}
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6">Product</th>
                                <th className="px-8 py-6">Description</th>
                                <th className="px-8 py-6">Unit</th>
                                <th className="px-8 py-6">Unit Price</th>
                                <th className="px-8 py-6">Quantity</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {inquiry.items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 tracking-tight leading-none">{item.product}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 italic">Safety Equipment</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-slate-500 italic">{item.description}</span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-700">{item.unit || 'Pieces'}</td>
                                    <td className="px-8 py-6 font-black text-primary-600 text-lg tracking-tighter">${item.unitPrice}</td>
                                    <td className="px-8 py-6">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-900 border border-slate-100">
                                            {item.quantity}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleViewItem(item)}
                                            className="px-6 py-2.5 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm group-hover:shadow-md active:scale-95"
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

            <NewUnitDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inquiry={selectedItem}
            />
        </div>
    );
};

export default InquiryItemsList;
