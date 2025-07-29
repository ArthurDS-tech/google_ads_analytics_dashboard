import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const IA = () => {
  const [selectedConcept, setSelectedConcept] = useState('cpc');

  const googleAdsConcepts = [
    {
      id: 'cpc',
      name: 'CPC - Custo Por Clique',
      icon: 'MousePointer',
      color: 'primary',
      description: 'O valor que você paga cada vez que alguém clica no seu anúncio.',
      detailedExplanation: `
        O CPC (Cost Per Click) é uma das métricas mais fundamentais do Google Ads. Representa o valor médio que você paga por cada clique nos seus anúncios.

        **Como funciona:**
        • Você define um lance máximo que está disposto a pagar por clique
        • O Google usa um leilão para determinar qual anúncio será exibido
        • Você só paga quando alguém realmente clica no seu anúncio

        **Fatores que influenciam o CPC:**
        • Concorrência pela palavra-chave
        • Qualidade do seu anúncio (Quality Score)
        • Relevância da página de destino
        • Horário e localização da pesquisa

        **Dicas para otimizar:**
        • Melhore a qualidade dos seus anúncios
        • Use palavras-chave mais específicas (long-tail)
        • Otimize suas páginas de destino
        • Teste diferentes horários e localizações
      `,
      examples: [
        'CPC baixo: R$ 0,50 - R$ 2,00 (nichos menos competitivos)',
        'CPC médio: R$ 2,00 - R$ 10,00 (maioria dos mercados)',
        'CPC alto: R$ 10,00+ (seguros, advogados, finanças)'
      ]
    },
    {
      id: 'cpa',
      name: 'CPA - Custo Por Aquisição',
      icon: 'Target',
      color: 'success',
      description: 'O custo médio para adquirir um cliente ou conversão.',
      detailedExplanation: `
        O CPA (Cost Per Acquisition) mede quanto você gasta, em média, para conseguir uma conversão (venda, lead, cadastro, etc.).

        **Cálculo do CPA:**
        CPA = Gasto Total com Anúncios ÷ Número de Conversões

        **Por que é importante:**
        • Mostra a eficiência real dos seus anúncios
        • Ajuda a definir orçamentos realistas
        • Permite comparar diferentes campanhas
        • Facilita o cálculo do ROI

        **Estratégias para reduzir o CPA:**
        • Melhore a taxa de conversão da landing page
        • Use palavras-chave mais qualificadas
        • Otimize os textos dos anúncios
        • Implemente remarketing
        • Use automações inteligentes do Google

        **CPA Alvo:**
        Defina um CPA máximo baseado no valor que cada cliente traz para o seu negócio.
      `,
      examples: [
        'E-commerce: CPA de R$ 50 para venda de R$ 200',
        'Geração de leads: CPA de R$ 25 por lead qualificado',
        'SaaS: CPA de R$ 150 para assinatura mensal de R$ 99'
      ]
    },
    {
      id: 'roas',
      name: 'ROAS - Retorno do Investimento Publicitário',
      icon: 'TrendingUp',
      color: 'warning',
      description: 'A receita gerada para cada real investido em publicidade.',
      detailedExplanation: `
        O ROAS (Return on Advertising Spend) é a métrica que mostra quantos reais de receita você gera para cada real gasto em publicidade.

        **Cálculo do ROAS:**
        ROAS = Receita Gerada ÷ Gasto com Anúncios

        **Interpretação:**
        • ROAS de 1x = Você recupera o que gastou (break-even)
        • ROAS de 3x = Para cada R$ 1 gasto, você ganha R$ 3
        • ROAS de 5x = Retorno de R$ 5 para cada R$ 1 investido

        **ROAS por setor (referências):**
        • E-commerce: 4x - 6x é considerado bom
        • Serviços: 3x - 5x é aceitável
        • B2B: 2x - 4x pode ser suficiente

        **Como melhorar o ROAS:**
        • Aumente o valor médio do pedido
        • Melhore a taxa de conversão
        • Reduza o CPC através de otimizações
        • Foque em produtos com maior margem
        • Use remarketing para clientes existentes
      `,
      examples: [
        'Gasto: R$ 1.000 | Receita: R$ 4.000 | ROAS: 4x',
        'Gasto: R$ 500 | Receita: R$ 2.500 | ROAS: 5x',
        'Gasto: R$ 2.000 | Receita: R$ 6.000 | ROAS: 3x'
      ]
    },
    {
      id: 'ctr',
      name: 'CTR - Taxa de Cliques',
      icon: 'MousePointer2',
      color: 'accent',
      description: 'Percentual de pessoas que clicam no seu anúncio após vê-lo.',
      detailedExplanation: `
        O CTR (Click-Through Rate) mede o percentual de pessoas que clicam no seu anúncio em relação ao número total de visualizações.

        **Cálculo do CTR:**
        CTR = (Cliques ÷ Impressões) × 100

        **Benchmarks de CTR:**
        • Rede de Pesquisa: 2% - 5% é considerado bom
        • Rede Display: 0,5% - 1% é normal
        • Shopping: 0,7% - 1,5% é aceitável
        • YouTube: 1% - 3% é satisfatório

        **Por que o CTR é importante:**
        • Influencia diretamente o Quality Score
        • Afeta o CPC e posição dos anúncios
        • Indica relevância do anúncio para o público
        • Impacta o orçamento diário

        **Como melhorar o CTR:**
        • Escreva títulos mais atrativos e relevantes
        • Use extensões de anúncio
        • Inclua calls-to-action claros
        • Teste diferentes variações de anúncios
        • Use palavras-chave no texto do anúncio
        • Segmente melhor o público-alvo
      `,
      examples: [
        'Impressões: 10.000 | Cliques: 300 | CTR: 3%',
        'Impressões: 5.000 | Cliques: 150 | CTR: 3%',
        'Impressões: 20.000 | Cliques: 400 | CTR: 2%'
      ]
    }
  ];

  const selectedConceptData = googleAdsConcepts.find(concept => concept.id === selectedConcept);

  const handleChatGPTRedirect = () => {
    window.open('https://chatgpt.com/share/68869a00-58ac-800c-b034-f11535cf8137', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Guia Google Ads com IA</h1>
              <p className="text-muted-foreground">
                Aprenda os principais conceitos do Google Ads e tire dúvidas com inteligência artificial
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleChatGPTRedirect}
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Chat com IA
              </Button>
              
              <Button 
                size="sm"
                onClick={handleChatGPTRedirect}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Consultar ChatGPT
              </Button>
            </div>
          </div>

          {/* Concept Selector */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Principais Conceitos do Google Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {googleAdsConcepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedConcept === concept.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg bg-${concept.color}/10`}>
                      <Icon name={concept.icon} size={20} className={`text-${concept.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">{concept.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{concept.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {selectedConceptData && (
              <>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-lg bg-${selectedConceptData.color}/10`}>
                    <Icon name={selectedConceptData.icon} size={24} className={`text-${selectedConceptData.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{selectedConceptData.name}</h2>
                    <p className="text-muted-foreground">{selectedConceptData.description}</p>
                  </div>
                </div>
                
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-line">
                    {selectedConceptData.detailedExplanation}
                  </div>
                </div>
                
                {selectedConceptData.examples && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Exemplos Práticos:</h3>
                    <div className="space-y-2">
                      {selectedConceptData.examples.map((example, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                          <Icon name="ArrowRight" size={16} className="text-primary" />
                          <span className="text-sm text-foreground">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ChatGPT Integration */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Consultoria Personalizada com IA</h2>
                  <p className="text-muted-foreground">
                    Tire suas dúvidas específicas sobre Google Ads com inteligência artificial
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleChatGPTRedirect}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Acessar Chat
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">O que você pode perguntar:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <Icon name="MessageSquare" size={16} className="text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Estratégias específicas</p>
                      <p className="text-xs text-muted-foreground">Como otimizar campanhas para seu nicho</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <Icon name="Calculator" size={16} className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Cálculos personalizados</p>
                      <p className="text-xs text-muted-foreground">ROAS, CPA e orçamentos ideais</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <Icon name="TrendingUp" size={16} className="text-green-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Análise de performance</p>
                      <p className="text-xs text-muted-foreground">Interpretação de métricas e KPIs</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Exemplos de perguntas:</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">"Meu CPC está em R$ 5,00, como posso reduzir?"</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">"Qual ROAS é ideal para e-commerce de moda?"</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">"Como melhorar CTR de campanhas Display?"</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">"Estratégia de lances para conversões"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IA;