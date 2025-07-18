import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const CampaignFilters = ({ onFiltersChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativa' },
    { value: 'paused', label: 'Pausada' },
    { value: 'budget_limited', label: 'Limitada por Orçamento' },
    { value: 'ended', label: 'Finalizada' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'search', label: 'Pesquisa' },
    { value: 'display', label: 'Display' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'video', label: 'Vídeo' },
    { value: 'app', label: 'App' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last_7_days', label: 'Últimos 7 dias' },
    { value: 'last_30_days', label: 'Últimos 30 dias' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'last_month', label: 'Mês passado' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'Todas as Performances' },
    { value: 'high_ctr', label: 'CTR Alto (>5%)' },
    { value: 'low_ctr', label: 'CTR Baixo (<2%)' },
    { value: 'high_conversion', label: 'Alta Conversão (>10%)' },
    { value: 'low_conversion', label: 'Baixa Conversão (<2%)' },
    { value: 'over_budget', label: 'Acima do Orçamento' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: 'all',
      type: 'all',
      dateRange: 'last_30_days',
      performance: 'all',
      search: ''
    };
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.status !== 'all') count++;
    if (activeFilters.type !== 'all') count++;
    if (activeFilters.performance !== 'all') count++;
    if (activeFilters.search) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Limpar Filtros
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Pesquisar campanhas por nome..."
          value={activeFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={activeFilters.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Tipo de Campanha"
          options={typeOptions}
          value={activeFilters.type || 'all'}
          onChange={(value) => handleFilterChange('type', value)}
        />

        <Select
          label="Período"
          options={dateRangeOptions}
          value={activeFilters.dateRange || 'last_30_days'}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        {isExpanded && (
          <Select
            label="Performance"
            options={performanceOptions}
            value={activeFilters.performance || 'all'}
            onChange={(value) => handleFilterChange('performance', value)}
          />
        )}
      </div>

      {/* Active Filter Chips */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {activeFilters.status !== 'all' && (
            <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              <span>Status: {statusOptions.find(opt => opt.value === activeFilters.status)?.label}</span>
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-2 hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          {activeFilters.type !== 'all' && (
            <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              <span>Tipo: {typeOptions.find(opt => opt.value === activeFilters.type)?.label}</span>
              <button
                onClick={() => handleFilterChange('type', 'all')}
                className="ml-2 hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          {activeFilters.performance !== 'all' && (
            <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              <span>Performance: {performanceOptions.find(opt => opt.value === activeFilters.performance)?.label}</span>
              <button
                onClick={() => handleFilterChange('performance', 'all')}
                className="ml-2 hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
          {activeFilters.search && (
            <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              <span>Busca: "{activeFilters.search}"</span>
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignFilters;