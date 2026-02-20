/**
 * Mock data for the chat system.
 */
export const MOCK_MESSAGES = [
    {
        id: 1,
        queryId: 101, // Example Query ID
        sender: 'Customer',
        senderName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        text: 'Hello, I have a question about my fire extinguisher refill.',
        timestamp: '10:30 AM',
        isAgent: false
    },
    {
        id: 2,
        queryId: 101,
        sender: 'Agent',
        senderName: 'Agent Sarah',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        text: 'Hi John! I can help with that. What specifically would you like to know?',
        timestamp: '10:32 AM',
        isAgent: true
    },
    {
        id: 3,
        queryId: 101,
        sender: 'Customer',
        senderName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        text: 'I was wondering if the refill includes the pressure check as well.',
        timestamp: '10:35 AM',
        isAgent: false
    },
    {
        id: 4,
        queryId: 101,
        sender: 'Agent',
        senderName: 'Agent Sarah',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        text: 'Yes, absolutely. Every refill includes a full pressure test and nozzle inspection.',
        timestamp: '10:36 AM',
        isAgent: true
    },
    {
        id: 5,
        queryId: 101,
        sender: 'Customer',
        senderName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        text: 'Great, thanks for the info!',
        timestamp: '10:40 AM',
        isAgent: false
    }
];

export const MOCK_CUSTOMERS = {
    101: {
        name: 'John Doe',
        status: 'online',
        lastSeen: 'Now'
    },
    // Add more as needed for different queries
};
