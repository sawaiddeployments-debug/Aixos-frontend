import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Send } from 'lucide-react';
import NewUnitDetailModal from './NewUnitDetailModal';

const NewUnitTab = ({ data, initialInquiry }) => {
    const [selectedInquiry, setSelectedInquiry] = useState(initialInquiry || null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewItem = (item) => {
        setSelectedItem({
            ...selectedInquiry,
            selectedItem: item,
            quantity: item.quantity,
            unitType: item.product
        });
        setIsModalOpen(true);
    };

    if (selectedInquiry) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Inquiry <span className="text-primary-500">Items.</span></h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {selectedInquiry.inquiryNo} | {selectedInquiry.customer}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
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
                                {selectedInquiry.items?.map((item) => (
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
    }
    return null;
};

export default NewUnitTab;
