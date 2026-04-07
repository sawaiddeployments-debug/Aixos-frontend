const chatService = require('../backend/services/chatService');
const supabase = require('../backend/supabase');

async function run() {
    const testPayload = {
        sender_id: 'f94c0545-7331-428e-bdbd-230555f3883f',
        sender_type: 'partner',
        receiver_id: '46',
        receiver_role: 'customer',
        content: 'Verification test message ' + new Date().toISOString(),
        inquiry_id: '811df9d0-cc77-49ce-991c-46442bcd4dc7',
        message_type: 'text',
        status: 'sent'
    };

    try {
        console.log('--- Sending Direct Message ---');
        const message = await chatService.createDirectMessage(testPayload);
        console.log('✅ Message created:', message.id);

        console.log('\n--- Checking Notifications Table ---');
        const { data: notifs, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', '46')
            .eq('inquiry_id', '811df9d0-cc77-49ce-991c-46442bcd4dc7')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('❌ Error checking notifications:', error);
            process.exit(1);
        }

        if (notifs && notifs.length > 0) {
            const n = notifs[0];
            console.log('✅ Notification found!');
            console.log('ID:', n.id);
            console.log('Title:', n.title);
            console.log('Message:', n.message);
            console.log('Type:', n.type);
            
            if (n.title.includes('Partner') && n.type === 'message') {
                console.log('\n🎉 SUCCESS: Notification fields are correct!');
            } else {
                console.log('\n⚠️ WARNING: Notification fields mismatch.');
            }
        } else {
            console.log('❌ No notification found for this inquiry.');
        }

    } catch (err) {
        console.error('❌ Verification failed:', err);
        process.exit(1);
    }
}

run();
