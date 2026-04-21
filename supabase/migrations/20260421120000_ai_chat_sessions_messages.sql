-- Create ai_chat_sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now()
);

-- Create ai_chat_messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX idx_chat_sessions_partner ON ai_chat_sessions(partner_id);
CREATE INDEX idx_chat_messages_chat ON ai_chat_messages(chat_id);

-- RLS policies
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can manage own chat sessions"
  ON ai_chat_sessions FOR ALL
  USING (auth.uid() = partner_id);

CREATE POLICY "Partners can manage messages in own sessions"
  ON ai_chat_messages FOR ALL
  USING (
    chat_id IN (
      SELECT id FROM ai_chat_sessions WHERE partner_id = auth.uid()
    )
  );
