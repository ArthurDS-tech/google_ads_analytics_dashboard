import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ReportTemplateCard from './components/ReportTemplateCard';
import SavedReportItem from './components/SavedReportItem';
import ReportBuilder from './components/ReportBuilder';
import ReportConfiguration from './components/ReportConfiguration';
import ReportPreview from './components/ReportPreview';

const Reports = () => {
  const [activeView, setActiveView] = useState('builder'); // 'builder', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportConfig, setReportConfig] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('templates'); // 'templates', 'saved'

  const reportTemplates = [
    {
      id: 'campaign-overview',
      name: 'Visão Geral de Campanhas',
      category: 'Geral',
      description: 'Relatório completo com métricas principais, gráficos de performance e análise de ROI para todas as campanhas ativas.',
      icon: 'BarChart3',
      metrics: 12,
      lastUsed: '2 dias atrás',
      widgets: [
        { id: 'campaign-overview', name: 'Visão Geral de Campanhas', icon: 'BarChart3', type: 'chart' },
        { id: 'roi-summary', name: 'Resumo de ROI', icon: 'TrendingUp', type: 'metric' }
      ]
    },
    {
      id: 'keyword-performance',
      name: 'Performance de Palavras-chave',
      category: 'Palavras-chave',
      description: 'Análise detalhada do desempenho de palavras-chave com métricas de CTR, CPC e posição média.',
      icon: 'Hash',
      metrics: 8,
      lastUsed: '1 semana atrás',
      widgets: [
        { id: 'keyword-performance', name: 'Performance de Palavras-chave', icon: 'Hash', type: 'table' }
      ]
    },
    {
      id: 'geographic-analysis',
      name: 'Análise Geográfica',
      category: 'Localização',
      description: 'Relatório de performance por região geográfica com mapas interativos e métricas de conversão por localização.',
      icon: 'MapPin',
      metrics: 6,
      lastUsed: '3 dias atrás',
      widgets: [
        { id: 'geographic-analysis', name: 'Análise Geográfica', icon: 'MapPin', type: 'map' }
      ]
    },
    {
      id: 'roi-summary',
      name: 'Resumo de ROI',
      category: 'Financeiro',
      description: 'Análise financeira completa com ROAS, custo por conversão e retorno sobre investimento publicitário.',
      icon: 'TrendingUp',
      metrics: 10,
      lastUsed: '5 dias atrás',
      widgets: [
        { id: 'roi-summary', name: 'Resumo de ROI', icon: 'TrendingUp', type: 'metric' },
        { id: 'cost-analysis', name: 'Análise de Custos', icon: 'DollarSign', type: 'chart' }
      ]
    },
    {
      id: 'device-performance',
      name: 'Performance por Dispositivo',
      category: 'Dispositivos',
      description: 'Comparação de performance entre desktop, mobile e tablet com métricas específicas para cada dispositivo.',
      icon: 'Smartphone',
      metrics: 9,
      lastUsed: '1 dia atrás',
      widgets: [
        { id: 'device-performance', name: 'Performance por Dispositivo', icon: 'Smartphone', type: 'chart' }
      ]
    },
    {
      id: 'conversion-funnel',
      name: 'Funil de Conversão',
      category: 'Conversões',
      description: 'Análise do funil de conversão com taxas de conversão por etapa e identificação de gargalos.',
      icon: 'Filter',
      metrics: 7,
      lastUsed: '4 dias atrás',
      widgets: [
        { id: 'conversion-funnel', name: 'Funil de Conversão', icon: 'Filter', type: 'funnel' }
      ]
    }
  ];

  const savedReports = [
    {
      id: 'report-1',
      name: 'Relatório Mensal - Janeiro 2025',
      description: 'Relatório completo de performance para o mês de janeiro',
      status: 'generated',
      lastModified: '18/01/2025',
      isScheduled: true,
      template: 'campaign-overview'
    },
    {
      id: 'report-2',
      name: 'Análise Black Friday 2024',
      description: 'Relatório específico da campanha Black Friday',
      status: 'scheduled',
      lastModified: '15/01/2025',
      isScheduled: true,
      template: 'campaign-overview'
    },
    {
      id: 'report-3',
      name: 'Performance Palavras-chave Q4',
      description: 'Análise de palavras-chave do quarto trimestre',
      status: 'draft',
      lastModified: '12/01/2025',
      isScheduled: false,
      template: 'keyword-performance'
    },
    {
      id: 'report-4',
      name: 'ROI Campanhas Natal',
      description: 'Análise de retorno das campanhas de Natal',
      status: 'generated',
      lastModified: '10/01/2025',
      isScheduled: false,
      template: 'roi-summary'
    }
  ];

  const filteredTemplates = reportTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = savedReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSelectedReport(null);
    setActiveView('builder');
  };

  const handleTemplatePreview = (template) => {
    setSelectedTemplate(template);
    setSelectedReport({ ...template, name: template.name });
    setActiveView('preview');
  };

  const handleReportOpen = (report) => {
    const template = reportTemplates.find(t => t.id === report.template);
    setSelectedTemplate(template);
    setSelectedReport(report);
    setActiveView('preview');
  };

  const handleReportDuplicate = (report) => {
    console.log('Duplicating report:', report.name);
  };

  const handleReportDelete = (report) => {
    console.log('Deleting report:', report.name);
  };

  const handleReportSchedule = (report) => {
    console.log('Scheduling report:', report.name);
  };

  const handleSaveReport = () => {
    console.log('Saving report with config:', reportConfig);
  };

  const handleGenerateReport = (config = reportConfig) => {
    console.log('Generating report with config:', config);
  };

  const handleScheduleReport = (config) => {
    console.log('Scheduling report with config:', config);
  };

  const handleConfigChange = (config) => {
    setReportConfig(config);
  };

  const handleEditReport = () => {
    setActiveView('builder');
  };

  const handleClosePreview = () => {
    setActiveView('builder');
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
                <p className="text-muted-foreground">
                  Gere relatórios personalizados e agende entregas automáticas
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Configurações
                </Button>
                <Button>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Novo Relatório
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Sidebar - Templates and Saved Reports */}
            <div className="col-span-12 lg:col-span-3 flex flex-col">
              <div className="bg-card border border-border rounded-lg flex-1 flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-2 mb-4">
                    <Button
                      variant={activeTab === 'templates' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('templates')}
                      className="flex-1"
                    >
                      Templates
                    </Button>
                    <Button
                      variant={activeTab === 'saved' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('saved')}
                      className="flex-1"
                    >
                      Salvos
                    </Button>
                  </div>
                  <Input
                    placeholder={`Buscar ${activeTab === 'templates' ? 'templates' : 'relatórios'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === 'templates' ? (
                    <div className="space-y-3">
                      {filteredTemplates.map((template) => (
                        <ReportTemplateCard
                          key={template.id}
                          template={template}
                          onSelect={handleTemplateSelect}
                          onPreview={handleTemplatePreview}
                          isSelected={selectedTemplate?.id === template.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredReports.map((report) => (
                        <SavedReportItem
                          key={report.id}
                          report={report}
                          onOpen={handleReportOpen}
                          onDuplicate={handleReportDuplicate}
                          onDelete={handleReportDelete}
                          onSchedule={handleReportSchedule}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center Area - Report Builder or Preview */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-card border border-border rounded-lg h-full">
                {activeView === 'builder' ? (
                  <ReportBuilder
                    selectedTemplate={selectedTemplate}
                    onSave={handleSaveReport}
                    onGenerate={() => handleGenerateReport()}
                  />
                ) : (
                  <ReportPreview
                    report={selectedReport}
                    config={reportConfig}
                    onEdit={handleEditReport}
                    onGenerate={() => handleGenerateReport()}
                    onClose={handleClosePreview}
                  />
                )}
              </div>
            </div>

            {/* Right Panel - Configuration */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-card border border-border rounded-lg h-full">
                <ReportConfiguration
                  onConfigChange={handleConfigChange}
                  onSchedule={handleScheduleReport}
                  onGenerate={handleGenerateReport}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;