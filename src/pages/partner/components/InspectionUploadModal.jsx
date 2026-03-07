import React, { useState } from 'react';
import { Upload, X, FileText, Calendar, Type, Loader2 } from 'lucide-react';

const InspectionUploadModal = ({ isOpen, onClose, onSubmit, inquiry }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        file: null
    });
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only PDF and Excel (.xlsx) files are allowed.');
                setFormData({ ...formData, file: null });
            } else {
                setError('');
                setFormData({ ...formData, file });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.file) {
            setError('Please select a file to upload.');
            return;
        }
        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            onSubmit({
                ...formData,
                fileName: formData.file.name,
                inspector: 'Mark Johnson (Partner)' // Mocking inspector name
            });
            setIsUploading(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Upload Inspection Report</h2>
                        <p className="text-slate-500 text-sm font-medium">Inquiry: {inquiry?.inquiryNo}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Report Title</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                                placeholder="Site Inspection Report - Q1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Inspection Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notes (Optional)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Add any specific findings or comments..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload File (PDF or Excel)</label>
                        <div className={`group relative border-2 border-dashed ${error ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-primary-500 hover:bg-primary-50/30'} rounded-2xl p-8 transition-all cursor-pointer text-center`}>
                            {formData.file ? (
                                <div className="flex flex-col items-center">
                                    <FileText className="text-primary-500 mb-2" size={32} />
                                    <p className="text-sm font-bold text-slate-900">{formData.file.name}</p>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, file: null }); }} className="text-xs text-red-500 mt-2 font-bold hover:underline">Remove</button>
                                </div>
                            ) : (
                                <>
                                    <Upload className={`mx-auto mb-2 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-hover:text-primary-500'}`} size={32} />
                                    <p className={`text-sm font-bold transition-colors ${error ? 'text-red-600' : 'text-slate-600 group-hover:text-primary-600'}`}>Click to upload</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Supported: PDF, XLSX</p>
                                </>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                        </div>
                        {error && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">{error}</p>}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 shadow-primary flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-50"
                        >
                            {isUploading ? (
                                <><Loader2 className="animate-spin" size={18} /> Uploading...</>
                            ) : (
                                <><Upload size={18} /> Submit Report</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InspectionUploadModal;
