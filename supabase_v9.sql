-- ═══════════════════════════════════════════════════════════
-- ODARA PQCDSM v9 — Migração completa
-- Cole no SQL Editor do Supabase → Run
-- ═══════════════════════════════════════════════════════════

-- 1. Novos campos de perda detalhada no pqcdsm
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS tipo_input text DEFAULT 'embalagem';
-- Perdas de dosagem (kg)
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_dl_kg numeric DEFAULT 0;
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_biscoito_kg numeric DEFAULT 0;
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_rejeito_dosado_kg numeric DEFAULT 0;
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_quebra_bolacha_kg numeric DEFAULT 0;
-- Perdas de cobertura/embalagem (unidades)
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_dosado_un numeric DEFAULT 0;
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_coberto_un numeric DEFAULT 0;
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS perda_chocolate_un numeric DEFAULT 0;
-- Tipo produto para dosagem
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS tipo_produto text DEFAULT NULL;
-- Comentários por item de padrão
ALTER TABLE pqcdsm ADD COLUMN IF NOT EXISTS padroes_comentarios jsonb DEFAULT '{}';

-- 2. Tabela de configuração
CREATE TABLE IF NOT EXISTS config (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chave text UNIQUE NOT NULL,
  valor jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "config_read" ON config FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "config_write" ON config FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "config_update" ON config FOR UPDATE USING (true);

-- Insert defaults
INSERT INTO config (chave, valor) VALUES 
  ('metas', '{"P":95,"Q":3,"S":0,"M":95,"PAD":90}'),
  ('custos', '{"biscoito_kg":15,"dl_kg":15,"chocolate_kg":25,"embalagem_un":0.5}'),
  ('targets_peso', '{"classico":{"biscoito_3un":55.5,"dosado":65},"mini":{"biscoito_3un":22.5,"dosado":25},"zero":{"biscoito_3un":40.5,"dosado":45},"crocante":{"biscoito_3un":30,"dosado":35}}'),
  ('pessoas', '{"qualidade":[],"manutencao":[],"producao":[],"pcp":[],"almoxarifado":[]}')
ON CONFLICT (chave) DO NOTHING;

-- 3. Tabela de plano de ação
CREATE TABLE IF NOT EXISTS acoes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  data_abertura date NOT NULL DEFAULT CURRENT_DATE,
  origem text DEFAULT '',
  descricao text NOT NULL,
  responsavel text NOT NULL,
  prazo date,
  status text DEFAULT 'aberta',
  comentarios jsonb DEFAULT '[]',
  area text DEFAULT '',
  prioridade text DEFAULT 'media',
  data_conclusao date DEFAULT NULL,
  evidencia text DEFAULT ''
);
ALTER TABLE acoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "acoes_read" ON acoes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "acoes_write" ON acoes FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "acoes_update" ON acoes FOR UPDATE USING (true);
