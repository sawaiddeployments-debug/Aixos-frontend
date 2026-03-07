import React from 'react';
import { FileText, Calendar, User, Download, ExternalLink } from 'lucide-react';

const ReportViewerSection = ({ report }) => {
    if (!report) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary-500" /> Site Inspection Report
            </h3>

            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-primary-500 rounded-xl transition-all">
                        <ExternalLink size={18} />
                    </button>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
                        <FileText size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate pr-8">{report.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {report.fileName}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-xs font-medium">{report.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <User size={14} className="text-slate-400" />
                                <span className="text-xs font-medium truncate">{report.inspector}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {report.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inspector Notes</p>
                        <p className="text-sm text-slate-600 italic">"{report.notes}"</p>
                    </div>
                )}

                <button className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs">
                    <Download size={16} /> DOWNLOAD REPORT
                </button>
            </div>
        </div>
    );
};

export default ReportViewerSection;
