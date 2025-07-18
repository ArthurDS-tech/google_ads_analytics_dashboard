import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportConfiguration = ({ onConfigChange, onSchedule, onGenerate }) => {
  const [config, setConfig] = useState({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    accounts: [],
    campaigns: [],
    filters: {
      status: 'all',
      device: 'all',
      location: 'all'
    },
    groupBy: 'campaign',
    sortBy: 'cost',
    sortOrder: 'desc',
    limit: 100,
    includeZeroImpressions: false,
    includeRemovedItems: false
  });

  const [schedule, setSchedule] = useState({
    enabled: false,
    frequency: 'weekly',
    time: '09:00',
    timezone: 'America/Sao_Paulo',
    recipients: ['']
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'enabled', label: 'Ativo' },
    { value: 'paused', label: 'Pausado' },
    { value: 'removed', label: 'Removido' }
  ];

  const deviceOptions = [
    { value: 'all', label: 'Todos os Dispositivos' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' }
  ];

  const groupByOptions = [
    { value: 'campaign', label: 'Campanha' },
    { value: 'adgroup', label: 'Grupo de Anúncios' },
    { value: 'keyword', label: 'Palavra-chave' },
    { value: 'device', label: 'Dispositivo' },
    { value: 'location', label: 'Localização' },
    { value: 'date', label: 'Data' }
  ];

  const sortByOptions = [
    { value: 'cost', label: 'Custo' },
    { value: 'impressions', label: 'Impressões' },
    { value: 'clicks', label: 'Cliques' },
    { value: 'conversions', label: 'Conversões' },
    { value: 'ctr', label: 'CTR' },
    { value: 'cpc', label: 'CPC' },
    { value: 'roas', label: 'ROAS' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensalmente' },
    { value: 'quarterly', label: 'Trimestralmente' }
  ];

  useEffect(() => {
    // Set default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setConfig(prev => ({
      ...prev,
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    }));
  }, []);

  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const handleConfigChange = (field, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      
      // Handle nested fields
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newConfig[parent] = { ...newConfig[parent], [child]: value };
      } else {
        newConfig[field] = value;
      }
      
      return newConfig;
    });
  };

  const handleScheduleChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRecipient = () => {
    setSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const handleRemoveRecipient = (index) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const handleRecipientChange = (index, value) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? value : recipient
      )
    }));
  };

  const validateConfig = () => {
    const newErrors = {};
    
    if (!config.dateRange.startDate) {
      newErrors.startDate = 'Data inicial é obrigatória';
    }
    
    if (!config.dateRange.endDate) {
      newErrors.endDate = 'Data final é obrigatória';
    }
    
    if (config.dateRange.startDate && config.dateRange.endDate) {
      const start = new Date(config.dateRange.startDate);
      const end = new Date(config.dateRange.endDate);
      
      if (start > end) {
        newErrors.dateRange = 'Data inicial não pode ser posterior à data final';
      }
    }
    
    if (config.limit < 1 || config.limit > 10000) {
      newErrors.limit = 'Limite deve estar entre 1 e 10.000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validateConfig()) {
      onGenerate?.(config);
    }
  };

  const handleScheduleReport = () => {
    if (validateConfig()) {
      onSchedule?.(config, schedule);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground mb-1">Configuração do Relatório</h3>
        <p className="text-sm text-muted-foreground">Personalize os dados e filtros</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Período</h4>
          <div className="space-y-2">
            <Input
              type="date"
              label="Data Inicial"
              value={config.dateRange.startDate}
              onChange={(e) => handleConfigChange('dateRange.startDate', e.target.value)}
              error={errors.startDate}
            />
            <Input
              type="date"
              label="Data Final"
              value={config.dateRange.endDate}
              onChange={(e) => handleConfigChange('dateRange.endDate', e.target.value)}
              error={errors.endDate}
            />
            {errors.dateRange && (
              <p className="text-sm text-error">{errors.dateRange}</p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Filtros</h4>
          <div className="space-y-3">
            <Select
              label="Status"
              value={config.filters.status}
              onChange={(value) => handleConfigChange('filters.status', value)}
              options={statusOptions}
            />
            <Select
              label="Dispositivo"
              value={config.filters.device}
              onChange={(value) => handleConfigChange('filters.device', value)}
              options={deviceOptions}
            />
          </div>
        </div>

        {/* Grouping and Sorting */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Agrupamento e Ordenação</h4>
          <div className="space-y-3">
            <Select
              label="Agrupar por"
              value={config.groupBy}
              onChange={(value) => handleConfigChange('groupBy', value)}
              options={groupByOptions}
            />
            <Select
              label="Ordenar por"
              value={config.sortBy}
              onChange={(value) => handleConfigChange('sortBy', value)}
              options={sortByOptions}
            />
            <Select
              label="Ordem"
              value={config.sortOrder}
              onChange={(value) => handleConfigChange('sortOrder', value)}
              options={[
                { value: 'desc', label: 'Decrescente' },
                { value: 'asc', label: 'Crescente' }
              ]}
            />
          </div>
        </div>

        {/* Limits */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Limites</h4>
          <Input
            type="number"
            label="Limite de registros"
            value={config.limit}
            onChange={(e) => handleConfigChange('limit', parseInt(e.target.value))}
            min="1"
            max="10000"
            error={errors.limit}
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Opções</h4>
          <div className="space-y-3">
            <Checkbox
              label="Incluir itens com zero impressões"
              checked={config.includeZeroImpressions}
              onChange={(checked) => handleConfigChange('includeZeroImpressions', checked)}
            />
            <Checkbox
              label="Incluir itens removidos"
              checked={config.includeRemovedItems}
              onChange={(checked) => handleConfigChange('includeRemovedItems', checked)}
            />
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Agendamento</h4>
          <div className="space-y-3">
            <Checkbox
              label="Ativar agendamento automático"
              checked={schedule.enabled}
              onChange={(checked) => handleScheduleChange('enabled', checked)}
            />
            
            {schedule.enabled && (
              <div className="space-y-3 ml-4">
                <Select
                  label="Frequência"
                  value={schedule.frequency}
                  onChange={(value) => handleScheduleChange('frequency', value)}
                  options={frequencyOptions}
                />
                <Input
                  type="time"
                  label="Horário"
                  value={schedule.time}
                  onChange={(e) => handleScheduleChange('time', e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Destinatários
                  </label>
                  {schedule.recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={recipient}
                        onChange={(e) => handleRecipientChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRecipient(index)}
                        className="h-8 w-8 text-error hover:text-error"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddRecipient}
                    className="w-full"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Adicionar Destinatário
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          onClick={handleGenerate}
          className="w-full"
          size="lg"
        >
          <Icon name="FileText" size={16} className="mr-2" />
          Gerar Relatório
        </Button>
        
        {schedule.enabled && (
          <Button
            variant="outline"
            onClick={handleScheduleReport}
            className="w-full"
          >
            <Icon name="Clock" size={16} className="mr-2" />
            Agendar Relatório
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportConfiguration;