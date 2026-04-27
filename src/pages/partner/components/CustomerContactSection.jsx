import React from 'react';
import { User, ExternalLink } from 'lucide-react';

const DetailField = ({ label, value, className = '' }) => (
  <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 ${className}`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
    <p className="text-slate-900 font-semibold text-sm break-words">{value ?? '—'}</p>
  </div>
);

const CustomerContactSection = ({
  ownerName,
  email,
  phone,
  customerId,
  address,
  locationLat,
  locationLng,
}) => {
  const hasCoords = locationLat != null && locationLng != null;
  const hasAddr = address && address.trim();
  const mapUrl = hasCoords
    ? `https://www.google.com/maps?q=${locationLat},${locationLng}`
    : hasAddr
      ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
      : null;

  return (
    <div>
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <User size={16} /> Customer Contact
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField label="Owner" value={ownerName || '—'} />
        <DetailField
          label="Email"
          value={
            email ? (
              <a href={`mailto:${email}`} className="text-primary-600 hover:underline break-all">
                {email}
              </a>
            ) : '—'
          }
        />
        <DetailField
          label="Phone"
          value={
            phone ? (
              <a href={`tel:${phone}`} className="text-primary-600 hover:underline">
                {phone}
              </a>
            ) : '—'
          }
        />
        <DetailField label="Customer ID" value={customerId || '—'} />
        <DetailField
          label="Location"
          className="sm:col-span-2"
          value={
            <span className="flex items-center gap-3 flex-wrap">
              <span>{hasAddr ? address : hasCoords ? `${locationLat}, ${locationLng}` : '—'}</span>
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  <ExternalLink size={12} />
                  Open in Maps
                </a>
              )}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default CustomerContactSection;
