# Documentação Completa do Frontend - Google Ads Analytics Dashboard

## 📋 Índice
1. [Visão Geral do Projeto](#visao-geral)
2. [Arquitetura e Estrutura](#arquitetura)
3. [Configuração e Dependências](#configuracao)
4. [Sistema de Design](#design-system)
5. [Componentes UI Base](#componentes-ui)
6. [Páginas e Layouts](#paginas-layouts)
7. [Funcionalidades por Seção](#funcionalidades)
8. [Estilização e Temas](#estilizacao)
9. [Dados e Mock](#dados-mock)
10. [Rotas e Navegação](#rotas)

---

## 🎯 Visão Geral do Projeto {#visao-geral}

**Projeto:** Google Ads Analytics Dashboard  
**Tecnologia:** React 18 + Vite  
**Estilização:** Tailwind CSS + CSS Modules  
**Ícones:** Lucide React  
**Gráficos:** Recharts  
**Routing:** React Router DOM v6

### Principais Características
- Dashboard completo para análise de campanhas Google Ads
- Interface responsiva com design moderno
- Sistema de design consistente
- Múltiplas visualizações de dados (gráficos, tabelas, mapas)
- Filtros avançados e exportação de dados
- Gerenciamento de campanhas e palavras-chave
- Sistema de relatórios personalizáveis

---

## 🏗️ Arquitetura e Estrutura {#arquitetura}

### Estrutura de Diretórios
```
src/
├── components/
│   ├── ui/                 # Componentes base reutilizáveis
│   │   ├── Header.jsx      # Header principal com navegação
│   │   ├── Button.jsx      # Componente de botão customizável
│   │   ├── Input.jsx       # Input com variações
│   │   ├── Select.jsx      # Select customizado
│   │   ├── Checkbox.jsx    # Checkbox com estados
│   │   └── Breadcrumb.jsx  # Navegação breadcrumb
│   ├── AppIcon.jsx         # Wrapper para ícones Lucide
│   ├── AppImage.jsx        # Componente de imagem com fallback
│   ├── ErrorBoundary.jsx   # Boundary para captura de erros
│   └── ScrollToTop.jsx     # Scroll automático em mudanças de rota
├── pages/
│   ├── dashboard/          # Dashboard principal
│   ├── campaign-management/ # Gerenciamento de campanhas
│   ├── keyword-performance/ # Performance de palavras-chave
│   ├── reports/            # Sistema de relatórios
│   ├── campaign-analytics/ # Análises detalhadas
│   └── NotFound.jsx        # Página 404
├── styles/
│   ├── index.css           # Estilos globais
│   └── tailwind.css        # Configuração Tailwind + variáveis CSS
├── utils/
│   └── cn.js              # Utilitário para classes CSS
├── App.jsx                # Componente raiz
├── Routes.jsx             # Configuração de rotas
└── index.jsx              # Entry point
```

---

## ⚙️ Configuração e Dependências {#configuracao}

### package.json Principal
```json
{
  "name": "google-ads-dashboard",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.2",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.484.0",
    "recharts": "^2.15.2",
    "framer-motion": "^10.16.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "axios": "^1.8.4",
    "date-fns": "^4.1.0",
    "react-hook-form": "^7.55.0"
  }
}
```

### Configuração Tailwind CSS
```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sistema de cores baseado em variáveis CSS
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        // ... cores completas definidas
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-in": "slideIn 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
      }
    }
  }
}
```

### Variáveis CSS Customizadas
```css
/* src/styles/tailwind.css */
:root {
  /* Core Colors */
  --color-background: #F8FAFC;    /* slate-50 */
  --color-foreground: #1E293B;    /* slate-800 */
  --color-border: #E2E8F0;        /* slate-200 */
  --color-primary: #2563EB;       /* blue-600 */
  --color-success: #059669;       /* emerald-600 */
  --color-warning: #D97706;       /* amber-600 */
  --color-error: #DC2626;         /* red-600 */
  /* ... outras variáveis */
}
```

---

## 🎨 Sistema de Design {#design-system}

### Paleta de Cores
- **Primary:** Blue-600 (#2563EB) - Azul principal para elementos primários
- **Success:** Emerald-600 (#059669) - Verde para estados positivos
- **Warning:** Amber-600 (#D97706) - Laranja para alertas
- **Error:** Red-600 (#DC2626) - Vermelho para erros
- **Background:** Slate-50 (#F8FAFC) - Fundo principal
- **Foreground:** Slate-800 (#1E293B) - Texto principal

### Tipografia
- **Fonte Principal:** Inter (400, 500, 600)
- **Fonte Mono:** JetBrains Mono (para dados numéricos)
- **Escalas:** text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### Espaçamento e Layout
- **Container:** max-w-7xl mx-auto px-6
- **Grid:** Sistema flexível de 1-12 colunas
- **Gap:** 4, 6, 8 (1rem, 1.5rem, 2rem)
- **Padding:** p-4, p-6, p-8 para componentes

### Componentes de Sombra
```css
box-shadow: {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
}
```

---

## 🧩 Componentes UI Base {#componentes-ui}

### 1. Header Component
**Arquivo:** `src/components/ui/Header.jsx`

**Funcionalidades:**
- Navegação principal responsiva
- Menu mobile com drawer lateral
- Dropdown de usuário
- Notificações
- Logo e branding

**Props e Estados:**
```javascript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
  { label: 'Campanhas', path: '/campaign-management', icon: 'Target' },
  // ... outros itens
];
```

### 2. Button Component
**Arquivo:** `src/components/ui/Button.jsx`

**Variantes:**
- `default` - Botão primário azul
- `outline` - Botão com borda
- `ghost` - Botão transparente
- `success`, `warning`, `danger` - Estados coloridos

**Tamanhos:**
- `xs`, `sm`, `default`, `lg`, `xl`, `icon`

**Funcionalidades:**
```javascript
// Exemplos de uso
<Button variant="default" size="lg" iconName="Plus">Criar</Button>
<Button variant="outline" loading={true}>Carregando...</Button>
<Button variant="ghost" size="icon" iconName="Settings" />
```

### 3. Input Component
**Arquivo:** `src/components/ui/Input.jsx`

**Tipos:**
- text, email, password, number, search
- checkbox, radio (estilos especiais)

**Funcionalidades:**
```javascript
<Input
  label="Nome da Campanha"
  placeholder="Digite o nome..."
  required={true}
  error="Campo obrigatório"
  description="Texto de ajuda"
/>
```

### 4. Select Component
**Arquivo:** `src/components/ui/Select.jsx`

**Funcionalidades:**
- Dropdown customizado
- Busca interna (searchable)
- Seleção múltipla
- Opções com descrição
- Limpeza de valores

```javascript
<Select
  options={[
    { value: 'active', label: 'Ativa' },
    { value: 'paused', label: 'Pausada' }
  ]}
  searchable={true}
  multiple={false}
  clearable={true}
  onChange={handleChange}
/>
```

### 5. AppIcon Component
**Arquivo:** `src/components/AppIcon.jsx`

Wrapper para ícones Lucide React com fallback:
```javascript
<Icon name="BarChart3" size={24} color="currentColor" />
// Fallback automático para HelpCircle se ícone não existir
```

---

## 📄 Páginas e Layouts {#paginas-layouts}

### 1. Dashboard Principal
**Arquivo:** `src/pages/dashboard/index.jsx`

**Layout:**
- Header fixo no topo
- Breadcrumb navigation
- KPI Cards em grid responsivo
- Gráfico principal de performance
- Widget de seleção de conta
- Status de campanhas
- Painel de alertas
- Ações rápidas

**Componentes:**
- `KPICard` - Cards de métricas principais
- `PerformanceChart` - Gráfico de linha/barra
- `AccountSelector` - Seletor de contas Google Ads
- `CampaignStatusWidget` - Status das campanhas
- `AlertsPanel` - Alertas e notificações
- `QuickActions` - Ações rápidas

**KPI Metrics Displayed:**
```javascript
const kpiData = [
  { title: 'Gasto Total', value: 'R$ 28.450,00', change: '+12,5%' },
  { title: 'Impressões', value: '2.847.392', change: '+8,3%' },
  { title: 'Cliques', value: '89.234', change: '+15,7%' },
  { title: 'CTR', value: '3,13%', change: '+0,8%' },
  { title: 'ROAS', value: '4,2x', change: '-2,1%' }
];
```

### 2. Gerenciamento de Campanhas
**Arquivo:** `src/pages/campaign-management/index.jsx`

**Funcionalidades:**
- Lista completa de campanhas
- Filtros avançados
- Ações em lote
- Ordenação por colunas
- Estatísticas agregadas

**Componentes:**
- `CampaignTable` - Tabela principal com ordenação
- `CampaignFilters` - Filtros por status, tipo, performance
- `BulkActionsBar` - Barra de ações em lote (fixa na parte inferior)
- `CampaignStats` - Cards de estatísticas
- `CampaignStatusBadge` - Badge de status das campanhas

**Ações Disponíveis:**
- Pausar/Retomar campanhas
- Editar configurações
- Duplicar campanhas
- Excluir campanhas
- Exportar dados
- Alterar orçamentos em lote

### 3. Performance de Palavras-chave
**Arquivo:** `src/pages/keyword-performance/index.jsx`

**Layout:**
- Cards de resumo (3 colunas no topo)
- Área principal: Filtros + Tabela (3/4 da largura)
- Sidebar direita: Sugestões, Negativas, Termos (1/4 da largura)

**Componentes:**
- `KeywordSummaryCards` - Resumo de métricas
- `KeywordFilters` - Filtros específicos para palavras-chave
- `KeywordDataTable` - Tabela detalhada com métricas
- `KeywordSidebar` - Painel lateral com 3 abas

**Métricas da Tabela:**
```javascript
// Colunas da tabela
const columns = [
  'Palavra-chave', 'Tipo de Correspondência', 'Volume de Busca',
  'Concorrência', 'CPC Médio', 'Impressões', 'Cliques', 'CTR',
  'Pontuação de Qualidade', 'Conversões', 'Custo', 'Status'
];
```

### 4. Sistema de Relatórios
**Arquivo:** `src/pages/reports/index.jsx`

**Layout de 3 Colunas:**
1. **Coluna Esquerda (3/12):** Templates e Relatórios Salvos
2. **Coluna Central (6/12):** Builder ou Preview
3. **Coluna Direita (3/12):** Configurações

**Componentes:**
- `ReportTemplateCard` - Cards de templates
- `SavedReportItem` - Itens de relatórios salvos
- `ReportBuilder` - Constructor de relatórios
- `ReportConfiguration` - Painel de configuração
- `ReportPreview` - Visualização do relatório

**Templates Disponíveis:**
- Visão Geral de Campanhas
- Performance de Palavras-chave
- Análise Geográfica
- Resumo de ROI
- Performance por Dispositivo
- Funil de Conversão

### 5. Análises de Campanhas
**Arquivo:** `src/pages/campaign-analytics/index.jsx`

**Seções:**
- Cards de métricas (8 cards em grid)
- Gráfico de tendências (interativo)
- Mapa geográfico + Performance por dispositivo
- Heatmap de horários
- Tabela de palavras-chave top
- Insights e recomendações

**Componentes:**
- `MetricCard` - Cards de métricas individuais
- `PerformanceChart` - Gráfico multi-métrica
- `GeographicMap` - Mapa de performance por região
- `DevicePerformance` - Gráfico de pizza para dispositivos
- `HourlyHeatmap` - Heatmap de performance por hora/dia
- `KeywordTable` - Top palavras-chave
- `FilterPanel` - Painel lateral de filtros

---

## ⚡ Funcionalidades por Seção {#funcionalidades}

### Dashboard
**Funcionalidades Principais:**
- Seleção de período (7d, 30d, 90d, custom)
- Atualização de dados em tempo real
- Exportação de dados
- Modo de personalização (drag & drop)
- Troca de contas Google Ads
- Alertas em tempo real
- Ações rápidas (criar campanha, gerar relatório, etc.)

**Interações:**
```javascript
// Troca de período
const handleDateRangeChange = (range) => {
  setDateRange(range);
  // Trigger data refresh
};

// Ações rápidas
const quickActions = [
  { action: 'create_campaign', path: '/campaign-management' },
  { action: 'generate_report', path: '/reports' },
  { action: 'optimize_bids', path: '/campaign-analytics' }
];
```

### Gerenciamento de Campanhas
**Filtros Disponíveis:**
- Status: Ativa, Pausada, Limitada por Orçamento, Finalizada
- Tipo: Pesquisa, Display, Shopping, Vídeo, App
- Performance: CTR Alto/Baixo, Conversão Alta/Baixa, Acima do Orçamento
- Busca por nome

**Ações em Lote:**
```javascript
const bulkActions = [
  'pause', 'resume', 'delete', 'export', 
  'duplicate', 'change_budget'
];

// Implementação
const handleBulkAction = (action, campaignIds) => {
  switch (action) {
    case 'pause':
      // Pausar campanhas selecionadas
      break;
    case 'change_budget':
      // Abrir modal de alteração de orçamento
      break;
  }
};
```

### Performance de Palavras-chave
**Sidebar com 3 Abas:**

1. **Sugestões:** Palavras-chave recomendadas com métricas
2. **Negativas:** Lista de palavras-chave negativas
3. **Termos:** Termos de busca com classificação

**Métricas Detalhadas:**
```javascript
const keywordMetrics = {
  searchVolume: 'Volume de busca mensal',
  competition: 'Nível de concorrência (Alta/Média/Baixa)',
  avgCpc: 'CPC médio sugerido',
  qualityScore: 'Pontuação de qualidade (1-10)',
  ctr: 'Taxa de cliques (%)',
  conversions: 'Número de conversões',
  conversionRate: 'Taxa de conversão (%)'
};
```

### Sistema de Relatórios
**Fluxo de Criação:**
1. Selecionar template ou relatório salvo
2. Configurar métricas e filtros
3. Visualizar preview
4. Salvar/Gerar/Agendar

**Configurações de Relatório:**
```javascript
const reportConfig = {
  dateRange: 'last_30_days',
  metrics: ['impressions', 'clicks', 'conversions'],
  filters: { status: 'active', type: 'search' },
  schedule: { frequency: 'weekly', day: 'monday' },
  format: 'pdf', // pdf, excel, csv
  recipients: ['email1@domain.com']
};
```

### Análises de Campanhas
**Visualizações Interativas:**

1. **Gráfico de Tendências:** Multi-métrica com seleção de períodos
2. **Mapa Geográfico:** Performance por estado/região
3. **Performance por Dispositivo:** Distribuição Desktop/Mobile/Tablet
4. **Heatmap Horário:** Performance por dia da semana e hora
5. **Top Keywords:** Tabela das melhores palavras-chave

**Insights Automáticos:**
```javascript
const insights = [
  {
    type: 'opportunity',
    message: 'Terças-feiras às 14h mostram o melhor desempenho',
    action: 'Aumentar lances neste horário'
  },
  {
    type: 'warning',
    message: 'Performance em tablets está abaixo da média',
    action: 'Revisar anúncios para este dispositivo'
  }
];
```

---

## 🎨 Estilização e Temas {#estilizacao}

### Sistema de Classes Utilitárias
**Espaçamento Padrão:**
```css
/* Componentes principais */
.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
.card { background: var(--color-card); border: 1px solid var(--color-border); border-radius: 8px; }
.section-padding { padding: 2rem 1.5rem; }

/* Estados interativos */
.hover-lift { transition: transform 0.2s; }
.hover-lift:hover { transform: translateY(-2px); }
```

**Responsividade:**
```javascript
// Breakpoints Tailwind utilizados
const breakpoints = {
  sm: '640px',   // Mobile grande
  md: '768px',   // Tablet
  lg: '1024px',  // Laptop
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Desktop grande
};

// Grid responsivo padrão
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Animações
```css
/* Definidas no Tailwind config */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideIn {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Classes utilizadas */
.animate-fade-in { animation: fadeIn 200ms ease-out; }
.animate-slide-in { animation: slideIn 300ms ease-out; }
```

### Estados de Componentes
```javascript
// Estados visuais padronizados
const componentStates = {
  loading: 'opacity-50 pointer-events-none',
  disabled: 'opacity-50 cursor-not-allowed',
  active: 'bg-primary text-primary-foreground',
  hover: 'hover:bg-muted hover:text-foreground',
  focus: 'focus:ring-2 focus:ring-ring focus:ring-offset-2'
};
```

---

## 📊 Dados e Mock {#dados-mock}

### Estrutura de Dados das Campanhas
```javascript
const campaignSchema = {
  id: 'number',
  name: 'string',
  status: 'active|paused|budget_limited|ended',
  type: 'search|display|shopping|video|app',
  budget: 'number',
  spend: 'number',
  impressions: 'number',
  clicks: 'number',
  ctr: 'number',
  cpc: 'number',
  conversions: 'number',
  lastModified: 'ISO_DATE_STRING'
};

// Exemplo de dados
const mockCampaign = {
  id: 1,
  name: "Campanha Black Friday 2024",
  status: "active",
  type: "search",
  budget: 5000,
  spend: 3250.75,
  impressions: 125000,
  clicks: 3500,
  ctr: 2.8,
  cpc: 0.93,
  conversions: 87,
  lastModified: "2024-07-15T10:30:00Z"
};
```

### Estrutura de Palavras-chave
```javascript
const keywordSchema = {
  id: 'number',
  keyword: 'string',
  matchType: 'exact|phrase|broad',
  searchVolume: 'number',
  competition: 'Alta|Média|Baixa',
  avgCpc: 'number',
  impressions: 'number',
  clicks: 'number',
  ctr: 'number',
  qualityScore: 'number (1-10)',
  conversions: 'number',
  conversionRate: 'number',
  cost: 'number',
  status: 'active|paused'
};
```

### Dados de Análise Geográfica
```javascript
const geographicData = [
  { 
    id: 1, 
    name: 'São Paulo', 
    impressions: 850000, 
    cost: 12500.75, 
    performance: 85 
  },
  // ... outros estados
];
```

### Dados de Performance por Dispositivo
```javascript
const deviceData = [
  { name: 'Desktop', percentage: 45, cost: 20555.25 },
  { name: 'Mobile', percentage: 42, cost: 19184.58 },
  { name: 'Tablet', percentage: 13, cost: 5939.07 }
];
```

---

## 🚀 Rotas e Navegação {#rotas}

### Configuração de Rotas
**Arquivo:** `src/Routes.jsx`

```javascript
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/keyword-performance" element={<KeywordPerformance />} />
          <Route path="/campaign-management" element={<CampaignManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
```

### Navegação Principal
```javascript
const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
  { label: 'Campanhas', path: '/campaign-management', icon: 'Target' },
  { label: 'Palavras-chave', path: '/keyword-performance', icon: 'Hash' },
  { label: 'Análises', path: '/campaign-analytics', icon: 'TrendingUp' },
  { label: 'Relatórios', path: '/reports', icon: 'FileText' }
];
```

### Breadcrumb Mapping
```javascript
const breadcrumbMap = {
  '/dashboard': [{ label: 'Dashboard', path: '/dashboard' }],
  '/campaign-management': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Campanhas', path: '/campaign-management' }
  ],
  // ... outros mappings
};
```

---

## 📱 Responsividade e Mobile

### Breakpoints Utilizados
- **Mobile:** < 640px - Layout em coluna única
- **Tablet:** 640px - 1024px - Layout adaptado com menos colunas
- **Desktop:** > 1024px - Layout completo multi-coluna

### Padrões Responsivos
```javascript
// Grid responsivo padrão
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

// Espaçamento responsivo
"px-4 md:px-6 lg:px-8"

// Tipografia responsiva
"text-2xl md:text-3xl lg:text-4xl"

// Flexbox responsivo
"flex flex-col lg:flex-row lg:items-center lg:justify-between"
```

### Componentes Mobile-First
- **Header:** Menu hambúrguer com drawer lateral
- **Tables:** Cards empilhados em mobile, tabela em desktop
- **Filters:** Modais em mobile, sidebar em desktop
- **Charts:** Responsivos com Recharts

---

## 🔧 Utilitários e Helpers

### Função de Formatação
```javascript
// Utilitários de formatação utilizados
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};
```

### Classe Utility (cn)
```javascript
// src/utils/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Uso nos componentes
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

---

## 📋 Resumo Final

Este frontend é um dashboard completo para análise de campanhas Google Ads com:

✅ **5 páginas principais** com funcionalidades específicas  
✅ **20+ componentes** reutilizáveis e customizáveis  
✅ **Sistema de design consistente** com Tailwind CSS  
✅ **Interface responsiva** adaptada para todos os dispositivos  
✅ **Dados mock estruturados** para demonstração  
✅ **Navegação completa** com breadcrumbs e rotas  
✅ **Funcionalidades avançadas** como filtros, exportação e relatórios  

O projeto está pronto para produção e pode ser facilmente integrado com APIs reais do Google Ads. Toda a estrutura de dados e componentes está preparada para receber dados dinâmicos.