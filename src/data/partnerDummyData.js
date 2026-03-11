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
            description: 'The ABC fire extinguisher is effective against Class A (solids), Class B (liquids), and Class C (gases) fires. It is the most versatile extinguisher for homes and offices.'
        }
    },
    {
        catalog_no: 'CAT-1002',
        productName: 'Fire Extinguisher',
        category: 'Fire Safety',
        capacity: '5 KG',
        type: 'CO2',
        manufacturer: 'PureGuard Systems',
        specs: {
            cylinderMaterial: 'Aluminum',
            safetyCertification: 'BSI Kitemarked',
            description: 'Carbon Dioxide extinguishers are ideal for electrical fires and flammable liquid fires. They leave no residue, making them perfect for server rooms and kitchens.'
        }
    },
    {
        catalog_no: 'CAT-1003',
        productName: 'Eco-Foam Fire Extinguisher',
        category: 'Fire Safety',
        capacity: '9 Liters',
        type: 'AFFF Foam',
        manufacturer: 'EcoFire Tech',
        specs: {
            cylinderMaterial: 'Stainless Steel',
            safetyCertification: 'LPCB Approved',
            description: 'Foam extinguishers provide a fast flame knockdown and have a cooling effect. They are suitable for Class A and Class B fires.'
        }
    },
    {
        catalog_no: 'CAT-2001',
        productName: 'Marine Grade CO2 Extinguisher',
        category: 'Fire Safety',
        capacity: '2 KG',
        type: 'CO2',
        manufacturer: 'SeaSafe Equipment',
        specs: {
            cylinderMaterial: 'Aluminum',
            safetyCertification: 'MED Approved',
            description: 'Specifically designed for marine environments, this CO2 extinguisher is corrosion-resistant and highly effective for small electrical fires on boats.'
        }
    },
    {
        catalog_no: 'CAT-2002',
        productName: 'Industrial High-Pressure CO2',
        category: 'Fire Safety',
        capacity: '5 KG',
        type: 'CO2',
        manufacturer: 'PureGuard Systems',
        specs: {
            cylinderMaterial: 'High-Grade Steel',
            safetyCertification: 'BSI Kitemarked',
            description: 'A heavy-duty CO2 extinguisher built for industrial server rooms and manufacturing plants. Provides rapid cooling and non-conductive suppression.'
        }
    }
];

export const newUnitInquiries = [
    {
        id: 'NU-9001',
        inquiryNo: 'INQ-551',
        customer: 'Modern Apartments',
        unitType: 'Fire Extinguisher',
        shortDescription: 'Safety Cylinder',
        quantity: 10,
        status: 'Pending',
        items: [
            { catalog_no: 'CAT-1001', product: 'Fire Extinguisher', systemPrice: 120 },
            { catalog_no: 'CAT-1002', product: 'Fire Extinguisher', systemPrice: 150 },
            { catalog_no: 'CAT-1003', product: 'Fire Extinguisher', systemPrice: 180 }
        ]
    },
    {
        id: 'NU-9002',
        inquiryNo: 'INQ-992',
        customer: 'Green Valley Residency',
        unitType: 'CO2 Extinguisher',
        shortDescription: 'Server Room Safety',
        quantity: 5,
        status: 'Quoted',
        items: [
            { catalog_no: 'CAT-2002', product: 'CO2 Extinguisher', systemPrice: 250 }
        ]
    },
    {
        id: 'NU-9003',
        inquiryNo: 'INQ-1024',
        customer: 'Blue Square Tech',
        unitType: 'Foam Extinguisher',
        shortDescription: 'Warehouse Protection',
        quantity: 20,
        status: 'Pending',
        items: [
            { catalog_no: 'CAT-1003', product: 'Eco-Foam Extinguisher', systemPrice: 180 }
        ]
    }
];
