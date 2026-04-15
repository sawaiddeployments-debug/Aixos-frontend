import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../supabaseClient';

const GENAI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GENAI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  generationConfig: {
    temperature: 0.2, // Lower temperature for higher accuracy and less hallucination
  }
});

export const aiService = {
  /**
   * Fetches and filters context data from Supabase based on user query intent
   */
  async getFilteredContext(partnerId, question) {
    const today = new Date().toISOString().split('T')[0];
    const lowQuery = question.toLowerCase();
    
    // Base data containers
    let inquiries = [];
    let quotations = [];
    let stickers = [];
    let partnerInfo = {};

    // 1. Fetch Partner Info
    const { data: pData } = await supabase.from('partners').select('*').eq('id', partnerId).single();
    partnerInfo = pData || {};

    // 2. Fetch relevant tables based on keywords (Intent Detection)
    if (lowQuery.includes('inquiry') || lowQuery.includes('validation') || lowQuery.includes('refill') || lowQuery.includes('today')) {
      const { data } = await supabase
        .from('inquiries')
        .select('*, customers(business_name)')
        .eq('partner_id', partnerId);
      inquiries = data || [];
    }

    if (lowQuery.includes('earning') || lowQuery.includes('quotation') || lowQuery.includes('money') || lowQuery.includes('income')) {
      const { data } = await supabase.from('quotations').select('*').eq('partner_id', partnerId);
      quotations = data || [];
    }

    if (lowQuery.includes('sticker')) {
      const { data } = await supabase.from('sticker_usage_history').select('*').eq('partner_id', partnerId);
      stickers = data || [];
    }

    // 3. Build focused context
    const context = {
      date_today: today,
      partner_name: partnerInfo.owner_name || partnerInfo.business_name || 'Partner',
    };

    // Filter inquiries by intent
    if (inquiries.length > 0) {
      context.total_inquiries_count = inquiries.length;
      
      const mapInquiry = (i) => ({
        inquiry_no: i.inquiry_no,
        customer_name: i.customers?.business_name || 'Unknown',
        type: i.type,
        status: i.status,
        priority: i.priority,
        delivery_status: i.delivery_status,
        date: i.created_at.split('T')[0]
      });

      if (lowQuery.includes('today')) {
        context.inquiries_today = inquiries.filter(i => i.created_at.startsWith(today)).map(mapInquiry);
      }
      
      if (lowQuery.includes('refill')) {
        context.refilled_inquiries = inquiries.filter(i => i.type === 'Refill').map(mapInquiry);
      }

      if (lowQuery.includes('validation')) {
        context.validation_inquiries = inquiries.filter(i => i.type === 'Validation').map(mapInquiry);
      }

      // Default to general list if specific intent but not filtered
      if (!context.inquiries_today && !context.refilled_inquiries && !context.validation_inquiries) {
        context.recent_inquiries = inquiries.slice(-10).map(mapInquiry);
      }
    }

    // Filter earnings by intent
    if (quotations.length > 0) {
      context.total_earnings = quotations.reduce((sum, q) => sum + (Number(q.estimated_cost) || 0), 0);
      context.quotations_list = quotations.map(q => ({
        quotation_no: q.id, // Or another identifier if available
        amount: q.estimated_cost,
        status: q.status,
        date: q.created_at.split('T')[0]
      }));
    }

    // Filter stickers by intent
    if (stickers.length > 0 || partnerInfo.stickers_total !== undefined) {
      context.stickers_inventory = {
        total_available: partnerInfo.stickers_total || 0,
        used_history_count: stickers.length,
        recent_usage: stickers.slice(0, 10).map(s => ({ 
          sticker_code: s.sticker_code, 
          customer_id: s.customer_id,
          date: s.used_at.split('T')[0] 
        }))
      };
    }

    return context;
  },

  /**
   * Main function to interact with AI with strict filtering and prompt
   */
  async askAI(question, partnerId, currentHistory = []) {
    try {
      // 1. Get Targeted Context
      const context = await this.getFilteredContext(partnerId, question);

      // 2. DEBUG LOG (Requirement 6)
      console.log('--- AI DEBUG LOG ---');
      console.log('User Question:', question);
      console.log('Filtered Context:', JSON.stringify(context, null, 2));

      // 3. BLOCK EMPTY CONTEXT (Requirement 4)
      const hasData = Object.keys(context).length > 2; // more than just date and name
      if (!hasData && !question.toLowerCase().includes('hello') && !question.toLowerCase().includes('hi')) {
        return "Data not available for this specific query.";
      }

      const systemPrompt = `You are a Partner Dashboard AI assistant for AIXOS Firefighter.

STRICT RULES (CRITICAL):
1. Answer ONLY from the provided CONTEXT DATA below.
2. If the answer is not in the context, reply: 'Data not available'.
3. Do NOT guess, assume, or use general knowledge.
4. Do NOT give general business advice or explain how to find data elsewhere.
5. Only answer questions related to: inquiries, validation, refilled, quotations, stickers, earnings.
6. If the question is outside this scope, reply: 'This question is not related to your dashboard data.'
7. Always return results in a Markdown TABLE format when numbers, lists, or comparisons are involved.
8. Use all relevant available fields in tables (e.g., Inquiry No, Customer Name, Type, Status, Priority, Date, Delivery Status).
9. Keep responses extremely short and structured.

CONTEXT DATA:
${JSON.stringify(context, null, 2)}
`;

      const chat = model.startChat({
        history: currentHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.message || msg.content }]
        }))
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: `User Question: "${question}"` }
      ]);
      
      const responseText = result.response.text();

      // Save to History (Supabase)
      await this.saveHistory(partnerId, 'user', question);
      await this.saveHistory(partnerId, 'assistant', responseText);

      return responseText;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error.message?.includes('404')) {
         return "System update in progress. Please try again in a few minutes.";
      }
      return "I encountered an error while processing your request. Please try again later.";
    }
  },

  async saveHistory(partnerId, role, content) {
    const { error } = await supabase
      .from('ai_chat_history')
      .insert([{ partner_id: partnerId, role, content }]);
    if (error) console.error('Error saving chat history:', error);
  },

  async getChatHistory(partnerId) {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: true });
    return data || [];
  }
};
