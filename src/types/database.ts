export interface Extinguisher {
    id: number;
    customer_id: number;
    visit_id: number;
    type: string | null;
    capacity: string | null;
    quantity: number;
    install_date: string | null;
    last_refill_date: string | null;
    expiry_date: string | null;
    condition: 'Good' | 'Fair' | 'Poor' | 'Needs Replacement' | null;
    status: 'Valid' | 'Expired' | 'New' | 'Maintained' | 'Refilled' | null;
    certificate_photo: string | null;
    extinguisher_photo: string | null;
    brand: string | null;
    seller: string | null;
    partner_id: string | null; // UUID of the partner
    price: number | string | null;
    system: string | null;
    maintenance_notes: string | null;
    maintenance_voice_url: string | null;
    maintenance_unit_photo_url: string | null;
    is_sub_unit: boolean;
    unit: string | null;
    query_status: 'Active' | 'Resolved' | null;
    created_at: string;
}

export interface Partner {
    id: string; // UUID
    business_name: string;
    email: string;
    phone: string | null;
    status: 'Pending' | 'Active' | 'Suspended';
    created_at: string;
}

export interface Customer {
    id: number;
    business_name: string;
    owner_name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    business_type: string | null;
    status: 'Active' | 'Lead' | 'Inactive';
    location_lat: number | null;
    location_lng: number | null;
    qr_code_url: string | null;
}

export interface InquiryItem {
    id: number;
    extinguisher_id: number;
    serial_no: number;
    type: string | null;
    system_type: string | null;
    capacity: string | null;
    quantity: number;
    unit: string | null;
    price: number | string | null;
    system: string | null;
    condition: string | null;
    status: string | null;
    catalog_no: string | null;
    maintenance_notes: string | null;
    maintenance_voice_url: string | null;
    maintenance_unit_photo_url: string | null;
    is_sub_unit: boolean;
    query_status: 'Active' | 'Resolved' | null;
    created_at: string;
    updated_at: string;
}
