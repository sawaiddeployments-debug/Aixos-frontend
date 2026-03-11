import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Calculator, ChevronDown, CheckCircle, MessageCircle, Info, AlertCircle, Search, Maximize2 } from 'lucide-react';
import MockChatModal from './MockChatModal';
import ProductSpecsModal from './ProductSpecsModal';
import { productCatalog } from '../../../data/partnerDummyData';

const NewUnitDetailModal = ({ isOpen, onClose, inquiry }) => {
    const [selectedCatalogNo, setSelectedCatalogNo] = useState('');
    const [productInfo, setProductInfo] = useState(null);
    const [confirmedQuantity, setConfirmedQuantity] = useState(0);
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const estimatedPrice = pricePerUnit * confirmedQuantity;

    useEffect(() => {
        if (selectedCatalogNo) {
            const product = productCatalog.find(p => p.catalog_no === selectedCatalogNo);
            setProductInfo(product || null);
        } else {
            setProductInfo(null);
        }
    }, [selectedCatalogNo]);

    useEffect(() => {
        if (inquiry && isOpen) {
            setConfirmedQuantity(inquiry.quantity || 0);
            setPricePerUnit(0);
            setRemarks('');
            setSelectedCatalogNo('');
            setProductInfo(null);
        }
    }, [inquiry, isOpen]);

    if (!isOpen) return null;

    const requestedQuantity = inquiry?.quantity || 0;
    const isRemarksRequired = confirmedQuantity < requestedQuantity;

    const handleConfirm = () => {
        if (!selectedCatalogNo) {
            alert('Please select a catalog number');
            return;
        }
        if (isRemarksRequired && !remarks.trim()) {
            alert('Please add remarks since confirmed quantity is less than requested.');
            return;
        }
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
                                New Unit <span className="text-primary-500">Inquiry.</span>
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

                    <div className="p-8 max-h-[80vh] overflow-y-auto">
                        {!isSuccess ? (
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                                {/* Catalog Selection Row */}
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                            Select Catalog Number
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={selectedCatalogNo}
                                                onChange={(e) => setSelectedCatalogNo(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-12 appearance-none outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-slate-900 transition-all cursor-pointer"
                                            >
                                                <option value="">Choose Catalog No</option>
                                                {inquiry?.items?.map((item) => (
                                                    <option key={item.catalog_no} value={item.catalog_no}>
                                                        {item.catalog_no}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" size={20} />
                                        </div>
                                    </div>

                                </div>

                                {productInfo ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Product Details Section */}
                                        <div className="space-y-6">
                                            {/* 1. Product Name */}
                                            <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                                                <div className="p-3 bg-white/10 rounded-2xl">
                                                    <Package size={24} className="text-primary-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Product Name</p>
                                                    <h4 className="text-xl font-black tracking-tight">{productInfo.productName}</h4>
                                                </div>
                                                <button 
                                                    onClick={() => setIsProductModalOpen(true)}
                                                    className="ml-auto p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white"
                                                    title="View Full Specifications"
                                                >
                                                    <Maximize2 size={20} />
                                                </button>
                                            </div>

                                            {/* 2. Product Details Section (Attributes Grid) */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Product Details Section
                                                </label>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                                                        <p className="font-bold text-slate-900 text-sm">{productInfo.category}</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                                        <p className="font-bold text-slate-900 text-sm">{productInfo.capacity}</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                                                        <p className="font-bold text-slate-900 text-sm">{productInfo.type}</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer</p>
                                                        <p className="font-bold text-slate-900 text-sm truncate">{productInfo.manufacturer}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Pricing Section */}
                                            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Pricing Inputs</h5>
                                                    <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                                        Requested: {requestedQuantity}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                            Price per Unit ($)
                                                        </label>
                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary-500 transition-colors">$</div>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                value={pricePerUnit}
                                                                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                                                                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-10 pr-6 outline-none focus:bg-white focus:border-primary-500 font-black text-2xl text-slate-900 transition-all"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                            Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={confirmedQuantity}
                                                            onChange={(e) => setConfirmedQuantity(parseInt(e.target.value) || 0)}
                                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 px-6 outline-none focus:bg-white focus:border-primary-500 font-black text-2xl text-slate-900 transition-all"
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-primary-500 uppercase tracking-widest">
                                                            Estimated Price
                                                        </label>
                                                        <div className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 px-6 font-black text-2xl text-slate-400 cursor-not-allowed flex items-center shadow-inner">
                                                            <span className="mr-2">$</span>
                                                            {estimatedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 italic">Read-only, auto-calculated</p>
                                                    </div>
                                                </div>

                                                {isRemarksRequired && (
                                                    <div className="space-y-3 pt-4 border-t border-slate-50 animate-in slide-in-from-top-4">
                                                        <label className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                                            <AlertCircle size={14} /> Add Remarks (Required)
                                                        </label>
                                                        <textarea
                                                            value={remarks}
                                                            onChange={(e) => setRemarks(e.target.value)}
                                                            placeholder="Provide a reason for the lower quantity..."
                                                            className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-900 transition-all min-h-[100px]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleConfirm}
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[1.5rem] shadow-xl transition-all active:scale-[0.98] text-sm uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3"
                                        >
                                            Confirm Availability & Notify
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                                            <Search size={32} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for catalog selection...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight">Availability Confirmed!</h4>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto mt-4">
                                    The customer has been notified of the confirmed quantity and product details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductSpecsModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={productInfo}
            />

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
