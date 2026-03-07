export const dummyMaintenanceData = [
    {
        id: '1',
        extinguisherId: 'EXT-001',
        customerName: 'Global Corp HQ',
        location: 'Downtown, Block 4',
        inquiryNo: 'INQ-2024-001',
        status: 'Pending',
        details: {
            type: 'Annual Service',
            priority: 'High',
            issueReported: 'Gage showing low pressure on 2 units.'
        }
    },
    {
        id: '2',
        extinguisherId: 'EXT-002',
        customerName: 'Metro Mall',
        location: 'West Wing, Level 2',
        inquiryNo: 'INQ-2024-002',
        status: 'Accepted',
        details: {
            type: 'Refill',
            priority: 'Medium',
            issueReported: 'Unit discharged during fire drill.'
        }
    },
    {
        id: '3',
        extinguisherId: 'EXT-003',
        customerName: 'Tech Park',
        location: 'Building C, Floor 5',
        inquiryNo: 'INQ-2024-003',
        status: 'Inquiry Closed',
        details: {
            type: 'Inspection',
            priority: 'Low',
            issueReported: 'Routine quarterly check.'
        },
        remarks: 'All units certified.'
    }
];

export const dummyChatMessages = [
    {
        id: 1,
        sender: 'Client',
        text: 'Please clarify cylinder replacement cost.',
        time: '10:30 AM'
    },
    {
        id: 2,
        sender: 'Partner',
        text: 'Will update in revised quotation.',
        time: '10:35 AM'
    }
];
