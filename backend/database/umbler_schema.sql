-- =============================================
-- SCHEMA DO UMBLER PARA SUPABASE
-- =============================================

-- Tabela de contatos do Umbler
CREATE TABLE IF NOT EXISTS umbler_contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    tags JSONB DEFAULT '[]'::jsonb,
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de conversas do Umbler
CREATE TABLE IF NOT EXISTS umbler_conversations (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL REFERENCES umbler_contacts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mensagens do Umbler
CREATE TABLE IF NOT EXISTS umbler_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES umbler_conversations(id) ON DELETE CASCADE,
    contact_id TEXT NOT NULL REFERENCES umbler_contacts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document', 'location')),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'received' CHECK (status IN ('received', 'sent', 'delivered', 'read', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de logs de webhook
CREATE TABLE IF NOT EXISTS umbler_webhook_logs (
    id SERIAL PRIMARY KEY,
    webhook_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('processed', 'error', 'ignored')),
    payload JSONB NOT NULL,
    error_message TEXT,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para contatos
CREATE INDEX IF NOT EXISTS idx_umbler_contacts_phone ON umbler_contacts(phone);
CREATE INDEX IF NOT EXISTS idx_umbler_contacts_status ON umbler_contacts(status);
CREATE INDEX IF NOT EXISTS idx_umbler_contacts_last_interaction ON umbler_contacts(last_interaction DESC);
CREATE INDEX IF NOT EXISTS idx_umbler_contacts_tags ON umbler_contacts USING GIN(tags);

-- Índices para conversas
CREATE INDEX IF NOT EXISTS idx_umbler_conversations_contact_id ON umbler_conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_umbler_conversations_status ON umbler_conversations(status);
CREATE INDEX IF NOT EXISTS idx_umbler_conversations_last_message ON umbler_conversations(last_message_at DESC);

-- Índices para mensagens
CREATE INDEX IF NOT EXISTS idx_umbler_messages_conversation_id ON umbler_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_umbler_messages_contact_id ON umbler_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_umbler_messages_timestamp ON umbler_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_umbler_messages_direction ON umbler_messages(direction);

-- Índices para logs de webhook
CREATE INDEX IF NOT EXISTS idx_umbler_webhook_logs_type ON umbler_webhook_logs(webhook_type);
CREATE INDEX IF NOT EXISTS idx_umbler_webhook_logs_status ON umbler_webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_umbler_webhook_logs_processed_at ON umbler_webhook_logs(processed_at DESC);

-- =============================================
-- TRIGGERS PARA ATUALIZAR TIMESTAMPS
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_umbler_contacts_updated_at 
    BEFORE UPDATE ON umbler_contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umbler_conversations_updated_at 
    BEFORE UPDATE ON umbler_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGERS PARA ATUALIZAR CONTADORES
-- =============================================

-- Função para atualizar contador de mensagens na conversa
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE umbler_conversations 
        SET message_count = message_count + 1,
            last_message_at = NEW.timestamp
        WHERE id = NEW.conversation_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE umbler_conversations 
        SET message_count = GREATEST(message_count - 1, 0)
        WHERE id = OLD.conversation_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para atualizar contador de mensagens
CREATE TRIGGER update_conversation_message_count_trigger
    AFTER INSERT OR DELETE ON umbler_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_message_count();

-- Função para atualizar last_interaction do contato
CREATE OR REPLACE FUNCTION update_contact_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE umbler_contacts 
    SET last_interaction = NEW.timestamp
    WHERE id = NEW.contact_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar last_interaction
CREATE TRIGGER update_contact_last_interaction_trigger
    AFTER INSERT ON umbler_messages
    FOR EACH ROW EXECUTE FUNCTION update_contact_last_interaction();

-- =============================================
-- FUNÇÕES UTILITÁRIAS
-- =============================================

-- Função para buscar contatos com última mensagem
CREATE OR REPLACE FUNCTION get_contacts_with_last_message(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_status TEXT DEFAULT NULL
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    status TEXT,
    tags JSONB,
    last_interaction TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_message_content TEXT,
    last_message_timestamp TIMESTAMPTZ,
    last_message_direction TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        c.status,
        c.tags,
        c.last_interaction,
        c.metadata,
        c.created_at,
        c.updated_at,
        m.content as last_message_content,
        m.timestamp as last_message_timestamp,
        m.direction as last_message_direction
    FROM umbler_contacts c
    LEFT JOIN LATERAL (
        SELECT content, timestamp, direction
        FROM umbler_messages 
        WHERE contact_id = c.id 
        ORDER BY timestamp DESC 
        LIMIT 1
    ) m ON true
    WHERE (p_status IS NULL OR c.status = p_status)
    ORDER BY c.last_interaction DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Função para estatísticas do dashboard
CREATE OR REPLACE FUNCTION get_umbler_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalContacts', (SELECT COUNT(*) FROM umbler_contacts),
        'totalMessages', (SELECT COUNT(*) FROM umbler_messages),
        'totalConversations', (SELECT COUNT(*) FROM umbler_conversations),
        'openConversations', (SELECT COUNT(*) FROM umbler_conversations WHERE status = 'open'),
        'activeContacts', (SELECT COUNT(*) FROM umbler_contacts WHERE status = 'active'),
        'messagesLast24h', (
            SELECT COUNT(*) 
            FROM umbler_messages 
            WHERE timestamp >= NOW() - INTERVAL '24 hours'
        ),
        'messagesLast7days', (
            SELECT COUNT(*) 
            FROM umbler_messages 
            WHERE timestamp >= NOW() - INTERVAL '7 days'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- Habilitar RLS nas tabelas
ALTER TABLE umbler_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE umbler_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE umbler_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE umbler_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso total via service key
CREATE POLICY "Service role can do everything" ON umbler_contacts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON umbler_conversations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON umbler_messages
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON umbler_webhook_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- DADOS DE EXEMPLO (OPCIONAL - PARA DESENVOLVIMENTO)
-- =============================================

-- Inserir contatos de exemplo
INSERT INTO umbler_contacts (id, name, phone, email, status, tags, metadata) VALUES
('contact_demo_1', 'João Silva', '+55 11 99999-9999', 'joao@email.com', 'active', '["cliente", "vip"]', '{"platform": "whatsapp", "source": "demo"}'),
('contact_demo_2', 'Maria Santos', '+55 11 88888-8888', 'maria@email.com', 'active', '["prospect"]', '{"platform": "whatsapp", "source": "demo"}'),
('contact_demo_3', 'Pedro Oliveira', '+55 11 77777-7777', NULL, 'active', '["cliente"]', '{"platform": "whatsapp", "source": "demo"}')
ON CONFLICT (id) DO NOTHING;

-- Inserir conversas de exemplo
INSERT INTO umbler_conversations (id, contact_id, status, message_count, metadata) VALUES
('conv_demo_1', 'contact_demo_1', 'open', 2, '{"platform": "whatsapp"}'),
('conv_demo_2', 'contact_demo_2', 'open', 1, '{"platform": "whatsapp"}'),
('conv_demo_3', 'contact_demo_3', 'closed', 3, '{"platform": "whatsapp"}')
ON CONFLICT (id) DO NOTHING;

-- Inserir mensagens de exemplo
INSERT INTO umbler_messages (id, conversation_id, contact_id, content, message_type, direction, status, metadata) VALUES
('msg_demo_1', 'conv_demo_1', 'contact_demo_1', 'Olá! Gostaria de saber mais sobre seus serviços.', 'text', 'inbound', 'received', '{"platform": "whatsapp"}'),
('msg_demo_2', 'conv_demo_1', 'contact_demo_1', 'Claro! Ficarei feliz em ajudar. Que tipo de serviço você está procurando?', 'text', 'outbound', 'sent', '{"platform": "whatsapp"}'),
('msg_demo_3', 'conv_demo_2', 'contact_demo_2', 'Boa tarde! Vocês têm disponibilidade para esta semana?', 'text', 'inbound', 'received', '{"platform": "whatsapp"}'),
('msg_demo_4', 'conv_demo_3', 'contact_demo_3', 'Obrigado pelo atendimento!', 'text', 'inbound', 'received', '{"platform": "whatsapp"}'),
('msg_demo_5', 'conv_demo_3', 'contact_demo_3', 'De nada! Estamos sempre à disposição.', 'text', 'outbound', 'sent', '{"platform": "whatsapp"}')
ON CONFLICT (id) DO NOTHING;