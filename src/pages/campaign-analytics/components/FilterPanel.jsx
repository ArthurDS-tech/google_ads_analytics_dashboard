import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: '30',
    campaign: '',
    device: '',
    location: '',
    minImpressions: '',
    maxCost: '',
    conversionStatus: ''
  });

  const dateRangeOptions = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const deviceOptions = [
    { value: '', label: 'Todos os dispositivos' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' }
  ];

  const locationOptions = [
    { value: '', label: 'Todas as localizações' },
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'rs', label: 'Rio Grande do Sul' },
    { value: 'pr', label: 'Paraná' }
  ];

  const conversionOptions = [
    { value: '', label: 'Todas as campanhas' },
    { value: 'with', label: 'Com conversões' },
    { value: 'without', label: 'Sem conversões' }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: '30',
      campaign: '',
      device: '',
      location: '',
      minImpressions: '',
      maxCost: '',
      conversionStatus: ''
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-[1001] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Filtros Avançados</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          {/* Filters */}
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <Select
                label="Período"
                options={dateRangeOptions}
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
              />
            </div>
            
            {/* Campaign Search */}
            <div>
              <Input
                label="Buscar Campanha"
                type="text"
                placeholder="Digite o nome da campanha"
                value={filters.campaign}
                onChange={(e) => handleFilterChange('campaign', e.target.value)}
              />
            </div>
            
            {/* Device Filter */}
            <div>
              <Select
                label="Dispositivo"
                options={deviceOptions}
                value={filters.device}
                onChange={(value) => handleFilterChange('device', value)}
              />
            </div>
            
            {/* Location Filter */}
            <div>
              <Select
                label="Localização"
                options={locationOptions}
                value={filters.location}
                onChange={(value) => handleFilterChange('location', value)}
              />
            </div>
            
            {/* Performance Filters */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Filtros de Performance</h4>
              
              <Input
                label="Impressões Mínimas"
                type="number"
                placeholder="Ex: 1000"
                value={filters.minImpressions}
                onChange={(e) => handleFilterChange('minImpressions', e.target.value)}
              />
              
              <Input
                label="Custo Máximo (R$)"
                type="number"
                placeholder="Ex: 500"
                value={filters.maxCost}
                onChange={(e) => handleFilterChange('maxCost', e.target.value)}
              />
            </div>
            
            {/* Conversion Status */}
            <div>
              <Select
                label="Status de Conversão"
                options={conversionOptions}
                value={filters.conversionStatus}
                onChange={(value) => handleFilterChange('conversionStatus', value)}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3 mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Limpar
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Aplicar Filtros
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Filtros Rápidos</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleFilterChange('dateRange', '7')}>
                Última Semana
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFilterChange('device', 'mobile')}>
                Apenas Mobile
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFilterChange('conversionStatus', 'with')}>
                Com Conversões
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;