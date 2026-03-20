export const validationInquiries = [
    {
        id: 'V-1001',
        clientName: 'Al-Madina Hypermarket',
        agentName: 'Zubair Ahmed',
        stickersUsed: 45,
        status: 'Active',
        details: {
            createdDate: '2024-03-01',
            location: 'Main Blvd, Block H',
            stickerUtilization: [
                { type: 'ABC Dry Powder', count: 20, serialRange: 'ABC-001 to ABC-020' },
                { type: 'CO2 Extinguisher', count: 15, serialRange: 'CO2-500 to CO2-515' },
                { type: 'Water Type', count: 10, serialRange: 'WTR-900 to WTR-910' }
            ],
            agentNotes: 'Client needs verification for all installed units.'
        }
    },
    {
        id: 'V-1002',
        clientName: 'Blue Square Tech',
        agentName: 'Sara Khan',
        stickersUsed: 12,
        status: 'Pending',
        details: {
            createdDate: '2024-03-02',
            location: 'Tech Enclave, Phase 2',
            stickerUtilization: [
                { type: 'CO2 Extinguisher', count: 12, serialRange: 'CO2-600 to CO2-612' }
            ],
            agentNotes: 'New installation verification.'
        }
    }
];

export const maintenanceInquiries = [
    {
        id: 'M-5001',
        extinguisherId: 'EXT-9921',
        customerName: 'Grand Regency Hotel',
        location: 'Gulberg III, Lahore',
        inquiryNo: 'INQ-12345',
        status: 'Pending',
        details: {
            type: 'Annual Maintenance',
            priority: 'High',
            lastService: '2023-05-10',
            issueReported: 'Pressure gauge showing low reading on 3 units.'
        }
    },
    {
        id: 'M-5002',
        extinguisherId: 'EXT-1122',
        customerName: 'City Hospital',
        location: 'Model Town, Lahore',
        inquiryNo: 'INQ-67890',
        status: 'Accepted',
        details: {
            type: 'Quarterly Checkup',
            priority: 'Medium',
            lastService: '2024-01-15',
            issueReported: 'Routine inspection required.'
        }
    },
    {
        id: 'M-5003',
        extinguisherId: 'EXT-3344',
        customerName: 'Fast Food Chain',
        location: 'DHA Phase 5, Lahore',
        inquiryNo: 'INQ-44556',
        status: 'Assessment Done',
        details: {
            type: 'Emergency Repair',
            priority: 'Critical',
            lastService: '2023-11-20',
            issueReported: 'Pin missing and hose cracked.'
        },
        assessment: {
            observations: 'Found broken safety pin and dry-rotted discharge hose.',
            requiredServices: 'Replace Safety Pin, Replace Discharge Hose, Pressure Test.',
            cost: 85,
            notes: 'Completed checkup.'
        }
    }
];

export const refilledInquiries = [
    {
        id: 'R-7001',
        inquiryNo: 'REF-2021',
        customerName: 'Textile Mills Ltd',
        totalCylinders: 100,
        pickupType: 'Self Pickup',
        status: 'Pending',
        breakdown: {
            fillingCharges: 12,
            transportCharges: 3
        }
    },
    {
        id: 'R-7002',
        inquiryNo: 'REF-8892',
        customerName: 'Elite Schools Branch',
        totalCylinders: 25,
        pickupType: 'Agent Drop',
        status: 'In Progress',
        breakdown: {
            fillingCharges: 15,
            transportCharges: 0
        }
    },
    {
        id: 'R-7003',
        inquiryNo: 'REF-3341',
        customerName: 'Corporate Tower A',
        totalCylinders: 50,
        pickupType: 'Customer Drop',
        status: 'Completed',
        breakdown: {
            fillingCharges: 12,
            transportCharges: 0
        }
    }
];

export const productCatalog = [
    {
        catalog_no: 'CAT-1001',
        productName: 'Standard ABC Powder Extinguisher',
        category: 'Fire Safety',
        capacity: '6 KG',
        type: 'Dry Powder (ABC)',
        manufacturer: 'ABC Safety Solutions',
        specs: {
            cylinderMaterial: 'High-Grade Steel',
            safetyCertification: 'UL Listed / EN3-7',
            description: 'The ABC fire extinguisher is effective against Class A (solids), Class B (liquids), and Class C (gases) fires.'
        }
    },
    {
        catalog_no: 'CAT-1001-B',
        productName: 'Standard ABC Powder Extinguisher',
        category: 'Fire Safety',
        capacity: '4 KG',
        type: 'Dry Powder (ABC)',
        manufacturer: 'ABC Safety Solutions',
        specs: {
            cylinderMaterial: 'High-Grade Steel',
            safetyCertification: 'UL Listed',
            description: 'Compact version of the standard ABC powder extinguisher.'
        }
    },
    {
        catalog_no: 'CAT-1002',
        productName: 'Classic CO2 Extinguisher',
        category: 'Fire Safety',
        capacity: '5 KG',
        type: 'CO2',
        manufacturer: 'PureGuard Systems',
        specs: {
            cylinderMaterial: 'Aluminum',
            safetyCertification: 'BSI Kitemarked',
            description: 'Carbon Dioxide extinguishers are ideal for electrical fires and flammable liquid fires.'
        }
    },
    {
        catalog_no: 'CAT-1002-V2',
        productName: 'Classic CO2 Extinguisher',
        category: 'Fire Safety',
        capacity: '2 KG',
        type: 'CO2',
        manufacturer: 'PureGuard Systems',
        specs: {
            cylinderMaterial: 'Aluminum',
            safetyCertification: 'BSI Kitemarked',
            description: 'Lightweight CO2 extinguisher for small server cabinets.'
        }
    },
    {
        catalog_no: 'CAT-1003',
        productName: 'Eco-Foam Extinguisher',
        category: 'Fire Safety',
        capacity: '9 Liters',
        type: 'AFFF Foam',
        manufacturer: 'EcoFire Tech',
        specs: {
            cylinderMaterial: 'Stainless Steel',
            safetyCertification: 'LPCB Approved',
            description: 'Foam extinguishers provide a fast flame knockdown and have a cooling effect.'
        }
    }
];

export const newUnitInquiries = [
    {
        id: 'NU-9001',
        inquiryNo: 'INQ-551',
        customer: 'Modern Apartments',
        unitType: 'Mixed Safety Pack',
        shortDescription: 'Residential Protection',
        quantity: 15,
        status: 'Pending',
        items: [
            { 
                id: 'ITEM-1', 
                catalog_no: 'CAT-1001', 
                product: 'Standard ABC Powder Extinguisher', 
                description: '6KG Cylinder',
                unit: 'Pieces',
                unitPrice: 120,
                quantity: 5 
            },
            { 
                id: 'ITEM-2', 
                catalog_no: 'CAT-1002', 
                product: 'Classic CO2 Extinguisher', 
                description: '5KG Aluminum',
                unit: 'Pieces',
                unitPrice: 250,
                quantity: 10 
            }
        ]
    },
    {
        id: 'NU-9002',
        inquiryNo: 'INQ-992',
        customer: 'Green Valley Residency',
        unitType: 'Classic CO2 Extinguisher',
        shortDescription: 'Server Room Safety',
        quantity: 5,
        status: 'Quoted',
        items: [
            { 
                id: 'ITEM-3', 
                catalog_no: 'CAT-1002', 
                product: 'Classic CO2 Extinguisher', 
                description: '5KG Aluminum',
                unit: 'Pieces',
                unitPrice: 250,
                quantity: 5 
            }
        ]
    }
];
