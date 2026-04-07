import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, Building2, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { getInquiryById } from '../../api/partners';
import { acceptInquiry } from '../../api/maintenanceApi';
import PartnerInspectionReportModal from './components/PartnerInspectionReportModal';
import ValidationInquiryDetail from './components/ValidationInquiryDetail';
import RefillInquiryDetail from './components/RefillInquiryDetail';
import { buildValidationInquiryViewModel } from './utils/validationInquiryViewModel';
import { buildRefillInquiryViewModel } from './utils/refillInquiryViewModel';
import { toast } from 'react-hot-toast';

const getInquiryTypeKey = (inquiry) =>
    (inquiry?.type || inquiry?.inquiry_type || '').toString().trim().toLowerCase();

const isRefillInquiryType = (key) => key === 'refill' || key === 'refilled';

const InquiryCard = ({ item, inquiryId }) => (
    <Link
        to={`/partner/inquiry/${inquiryId}/item/${item.id}`}
        className="block bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-md active:scale-[0.985] transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="font-black text-primary-600 text-lg tracking-tight">
                    {item.system || 'Fire Equipment'}
                </p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {item.system_type || item.maintenance_notes || 'No description'}
                </p>
            </div>
            <div className="text-right">
                <div className="text-xs font-bold text-slate-400">QTY</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">{item.quantity || 1}</div>
            </div>
        </div>

        <div className="flex justify-between items-center text-sm">
            <div>
                <span className="text-xs text-slate-400">Unit Price</span>
                <p className="font-bold text-primary-600">SAR {item.price || 0}</p>
            </div>
            <div className="text-primary-600 font-medium flex items-center gap-1">
                View Details
                <ChevronRight size={18} />
            </div>
        </div>
    </Link>
);

const InquiryItemsList = () => {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const fetchInquiry = async () => {
        setLoading(true);
        try {
            const data = await getInquiryById(id);
            setInquiry(data);
            setError('');
        } catch (err) {
            console.error('Error fetching inquiry:', err);
            setError('Failed to load inquiry details. Please try again.');
            toast.error('Failed to load inquiry details');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        try {
            setLoading(true);
            await acceptInquiry(id);
            toast.success('Inquiry accepted successfully');
            await fetchInquiry();
        } catch (err) {
            console.error('Error accepting inquiry:', err);
            toast.error('Failed to accept inquiry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiry();
    }, [id]);

    const inquiryTypeKey = inquiry ? getInquiryTypeKey(inquiry) : '';
    const isValidation = inquiryTypeKey === 'validation';
    const isRefill = isRefillInquiryType(inquiryTypeKey);

    const validationViewModel = useMemo(() => {
        if (!inquiry || !isValidation) return null;
        return buildValidationInquiryViewModel(inquiry);
    }, [inquiry, isValidation]);

    const refillViewModel = useMemo(() => {
        if (!inquiry || !isRefill) return null;
        return buildRefillInquiryViewModel(inquiry);
    }, [inquiry, isRefill]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center">
                <p className="text-red-600 font-bold uppercase tracking-widest">{error}</p>
                <button onClick={fetchInquiry} className="text-primary-500 font-bold mt-4 inline-block underline">
                    Retry
                </button>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="p-12 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest">Inquiry not found</p>
                <Link to="/partner/dashboard" className="text-primary-500 font-bold mt-4 inline-block underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 px-4 md:px-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-10 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link
                        to="/partner/dashboard"
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Inquiries
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter uppercase italic">
                        {isValidation ? (
                            <>Validation <span className="text-primary-500">Inquiry.</span></>
                        ) : isRefill ? (
                            <>Refill <span className="text-primary-500">Inquiry.</span></>
                        ) : (
                            <>Inquiry <span className="text-primary-500">Items.</span></>
                        )}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-medium text-sm">
                            <Building2 size={18} className="text-primary-500" />
                            {inquiry.customers?.business_name || 'Generic Client'}
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-medium text-sm">
                            <Package size={18} className="text-primary-500" />
                            {inquiry.inquiry_no}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {inquiry.status?.toLowerCase() === 'pending' && (
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={loading}
                            className="px-8 py-3.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                            Accept Inquiry
                        </button>
                    )}

                    {(inquiry.status?.toLowerCase() === 'pending' || inquiry.status?.toLowerCase() === 'accepted') &&
                        (inquiry.inquiry_type?.toLowerCase() === 'maintenance' ||
                            inquiry.inquiry_type?.toLowerCase() === 'validation') && (
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="px-8 py-3.5 bg-primary-500 text-white hover:bg-primary-600 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                            >
                                <Eye size={18} /> Upload Report
                            </button>
                        )}
                </div>
            </div>

            {/* Conditional Detail Views */}
            {isValidation && validationViewModel ? (
                <ValidationInquiryDetail viewModel={validationViewModel} />
            ) : isRefill && refillViewModel ? (
                <RefillInquiryDetail viewModel={refillViewModel} />
            ) : (
                /* Fallback: Items List (for other inquiry types) */
                <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-xl overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-8 py-6">Product</th>
                                    <th className="px-8 py-6">Description</th>
                                    <th className="px-8 py-6">Unit</th>
                                    <th className="px-8 py-6">Unit Price</th>
                                    <th className="px-8 py-6">Quantity</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {(inquiry.inquiry_items || []).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No items available
                                        </td>
                                    </tr>
                                )}
                                {(inquiry.inquiry_items || []).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-slate-900">{item.system || 'Fire Equipment'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500">
                                            {item.system_type || item.maintenance_notes || '—'}
                                        </td>
                                        <td className="px-8 py-6 font-medium text-slate-700">{item.unit || 'Pieces'}</td>
                                        <td className="px-8 py-6 font-bold text-primary-600">
                                            SAR {item.price || 0}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-2xl font-bold text-slate-900">
                                                {item.quantity || 1}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                to={`/partner/inquiry/${id}/item/${item.id}`}
                                                className="inline-block px-6 py-2.5 bg-slate-900 text-white hover:bg-primary-600 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="block md:hidden p-6 space-y-4">
                        {(inquiry.inquiry_items || []).length === 0 ? (
                            <div className="text-center py-12 text-slate-400 font-medium">
                                No items available
                            </div>
                        ) : (
                            (inquiry.inquiry_items || []).map((item) => (
                                <InquiryCard key={item.id} item={item} inquiryId={id} />
                            ))
                        )}
                    </div>
                </div>
            )}

            <PartnerInspectionReportModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                inquiryId={id}
                inquiryNo={inquiry.inquiry_no}
                onSuccess={() => {
                    fetchInquiry();
                    setIsUploadModalOpen(false);
                }}
            />
        </div>
    );
};

export default InquiryItemsList;