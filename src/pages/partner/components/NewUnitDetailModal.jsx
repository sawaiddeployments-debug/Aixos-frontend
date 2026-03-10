import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calculator, ChevronDown, CheckCircle, MessageCircle } from 'lucide-react';
import MockChatModal from './MockChatModal';

const NewUnitDetailModal = ({ isOpen, onClose, inquiry }) => {
    const [selectedCatalogNo, setSelectedCatalogNo] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [partnerPrice, setPartnerPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (selectedCatalogNo && inquiry?.items) {
            const item = inquiry.items.find(it => it.catalog_no === selectedCatalogNo);
            if (item) {
                setSelectedItem(item);
                setPartnerPrice(item.systemPrice);
                setQuantity(1);
            }
        } else {
            setSelectedItem(null);
            setPartnerPrice(0);
            setQuantity(1);
        }
    }, [selectedCatalogNo, inquiry]);

    if (!isOpen) return null;

    const totalPrice = partnerPrice * quantity;

    const handleConfirm = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 1500);
    };

    return (
        <>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                Inquiry <span className="text-primary-500">Details.</span>
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-slate-500 text-sm font-medium">
                                    {inquiry?.customer} — {inquiry?.inquiryNo}
                                </p>
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    <MessageCircle size={14} /> Message Customer
                                </button>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8">
                        {!isSuccess ? (
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                                {/* Catalog Selection */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                        Select Catalog Number
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={selectedCatalogNo}
                                            onChange={(e) => setSelectedCatalogNo(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-12 appearance-none outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-slate-900 transition-all cursor-pointer"
                                        >
                                            <option value="">Choose a Catalog No</option>
                                            {inquiry?.items?.map((item) => (
                                                <option key={item.catalog_no} value={item.catalog_no}>
                                                    {item.catalog_no}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" size={20} />
                                    </div>
                                </div>

                                {selectedItem ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Item Preview */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Product</p>
                                                <div className="flex items-center gap-2">
                                                    <Package size={16} className="text-primary-500" />
                                                    <p className="font-bold text-slate-900">{selectedItem.product}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Price</p>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign size={16} className="text-emerald-500" />
                                                    <p className="font-bold text-slate-900">${selectedItem.systemPrice}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inputs */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Price per Unit ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={partnerPrice}
                                                    onChange={(e) => setPartnerPrice(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-slate-900 transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-slate-900 transition-all shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Total Calculation */}
                                        <div className="bg-primary-500 p-8 rounded-[2rem] text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                                <Calculator size={80} />
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-black text-primary-100 uppercase tracking-[0.2em] mb-2">Estimated Total Price</p>
                                                <h4 className="text-5xl font-black tracking-tighter">${totalPrice.toLocaleString()}</h4>
                                                <p className="text-xs font-medium text-primary-100 mt-2 italic opacity-80">
                                                    {quantity} units @ ${partnerPrice} each
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleConfirm}
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest mt-4"
                                        >
                                            Confirm & Process
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Package size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">Please select a catalog number to view product details.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Calculation Updated!</h4>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto mt-4">
                                    The unit pricing for {selectedCatalogNo} has been processed and saved to the dashboard.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MockChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                customerName={inquiry?.customer}
                inquiryNo={inquiry?.inquiryNo}
            />
        </>
    );
};

export default NewUnitDetailModal;
