import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportConfiguration = ({ onConfigChange, onSchedule, onGenerate }) => {
  const [config, setConfig] = useState({
    dateRange: 'last-30-days',
    customStartDate: '',
    customEndDate: '',
    campaigns: [],
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    includeExecutiveSummary: true,
    brandingEnabled: false,
    logoUrl: '',
    companyName: '',
    reportTitle: 'Relatório de Performance - Google Ads',
    recipients: '',
    scheduleFrequency: 'manual',
    scheduleDay: 'monday',
    scheduleTime: '09:00'
  });

  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last-7-days', label: 'Últimos 7 dias' },
    { value: 'last-30-days', label: 'Últimos 30 dias' },
    { value: 'last-90-days', label: 'Últimos 90 dias' },
    { value: 'this-month', label: 'Este mês' },
    { value: 'last-month', label: 'Mês passado' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel (XLSX)' },
    { value: 'powerpoint', label: 'PowerPoint (PPTX)' },
    { value: 'csv', label: 'CSV' }
  ];

  const campaignOptions = [
    { value: 'all', label: 'Todas as campanhas' },
    { value: 'campaign-1', label: 'Campanha Black Friday 2024' },
    { value: 'campaign-2', label: 'Campanha Natal 2024' },
    { value: 'campaign-3', label: 'Campanha Verão 2025' },
    { value: 'campaign-4', label: 'Campanha Institucional' }
  ];

  const frequencyOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' }
  ];

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Configurações do Relatório</h2>
        <p className="text-sm text-muted-foreground">Personalize seu relatório</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Range */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Período de Dados</h3>
          <Select
            label="Período"
            options={dateRangeOptions}
            value={config.dateRange}
            onChange={(value) => handleConfigChange('dateRange', value)}
            className="mb-3"
          />
          
          {config.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Data inicial"
                type="date"
                value={config.customStartDate}
                onChange={(e) => handleConfigChange('customStartDate', e.target.value)}
              />
              <Input
                label="Data final"
                type="date"
                value={config.customEndDate}
                onChange={(e) => handleConfigChange('customEndDate', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Campaign Selection */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Campanhas</h3>
          <Select
            label="Selecionar campanhas"
            options={campaignOptions}
            value={config.campaigns}
            onChange={(value) => handleConfigChange('campaigns', value)}
            multiple
            searchable
          />
        </div>

        {/* Format Options */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Formato de Saída</h3>
          <Select
            label="Formato"
            options={formatOptions}
            value={config.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
        </div>

        {/* Content Options */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Conteúdo do Relatório</h3>
          <div className="space-y-3">
            <Checkbox
              label="Incluir gráficos"
              checked={config.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e.target.checked)}
            />
            <Checkbox
              label="Incluir tabelas detalhadas"
              checked={config.includeTables}
              onChange={(e) => handleConfigChange('includeTables', e.target.checked)}
            />
            <Checkbox
              label="Incluir resumo executivo"
              checked={config.includeExecutiveSummary}
              onChange={(e) => handleConfigChange('includeExecutiveSummary', e.target.checked)}
            />
          </div>
        </div>

        {/* Branding */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Personalização de Marca</h3>
          <Checkbox
            label="Ativar marca personalizada"
            description="Adicione sua logo e informações da empresa"
            checked={config.brandingEnabled}
            onChange={(e) => handleConfigChange('brandingEnabled', e.target.checked)}
            className="mb-3"
          />
          
          {config.brandingEnabled && (
            <div className="space-y-3">
              <Input
                label="Nome da empresa"
                value={config.companyName}
                onChange={(e) => handleConfigChange('companyName', e.target.value)}
                placeholder="Digite o nome da sua empresa"
              />
              <Input
                label="URL da logo"
                value={config.logoUrl}
                onChange={(e) => handleConfigChange('logoUrl', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
              />
              <Input
                label="Título do relatório"
                value={config.reportTitle}
                onChange={(e) => handleConfigChange('reportTitle', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Scheduling */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Agendamento</h3>
          <Select
            label="Frequência"
            options={frequencyOptions}
            value={config.scheduleFrequency}
            onChange={(value) => handleConfigChange('scheduleFrequency', value)}
            className="mb-3"
          />
          
          {config.scheduleFrequency !== 'manual' && (
            <div className="space-y-3">
              {config.scheduleFrequency === 'weekly' && (
                <Select
                  label="Dia da semana"
                  options={dayOptions}
                  value={config.scheduleDay}
                  onChange={(value) => handleConfigChange('scheduleDay', value)}
                />
              )}
              <Input
                label="Horário"
                type="time"
                value={config.scheduleTime}
                onChange={(e) => handleConfigChange('scheduleTime', e.target.value)}
              />
              <Input
                label="Destinatários (emails separados por vírgula)"
                value={config.recipients}
                onChange={(e) => handleConfigChange('recipients', e.target.value)}
                placeholder="email1@exemplo.com, email2@exemplo.com"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={() => onGenerate(config)}
          className="w-full"
        >
          <Icon name="FileText" size={16} className="mr-2" />
          Gerar Relatório Agora
        </Button>
        
        {config.scheduleFrequency !== 'manual' && (
          <Button
            variant="outline"
            onClick={() => onSchedule(config)}
            className="w-full"
          >
            <Icon name="Calendar" size={16} className="mr-2" />
            Agendar Relatório
          </Button>
        )}
        
        <Button
          variant="ghost"
          className="w-full"
        >
          <Icon name="Save" size={16} className="mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default ReportConfiguration;