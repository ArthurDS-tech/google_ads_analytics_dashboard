import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KeywordFilters = ({ onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchType, setMatchType] = useState('');
  const [qualityScore, setQualityScore] = useState('');
  const [performanceLevel, setPerformanceLevel] = useState('');
  const [bidRange, setBidRange] = useState({ min: '', max: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const matchTypeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'exact', label: 'Correspondência exata' },
    { value: 'phrase', label: 'Correspondência de frase' },
    { value: 'broad', label: 'Correspondência ampla' },
    { value: 'broad_modified', label: 'Correspondência ampla modificada' }
  ];

  const qualityScoreOptions = [
    { value: '', label: 'Todas as pontuações' },
    { value: '1-3', label: '1-3 (Baixa)' },
    { value: '4-6', label: '4-6 (Média)' },
    { value: '7-10', label: '7-10 (Alta)' }
  ];

  const performanceOptions = [
    { value: '', label: 'Todos os níveis' },
    { value: 'high', label: 'Alto desempenho' },
    { value: 'medium', label: 'Desempenho médio' },
    { value: 'low', label: 'Baixo desempenho' },
    { value: 'underperforming', label: 'Abaixo da média' }
  ];

  const handleApplyFilters = () => {
    const filters = {
      searchTerm,
      matchType,
      qualityScore,
      performanceLevel,
      bidRange
    };
    onFiltersChange?.(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMatchType('');
    setQualityScore('');
    setPerformanceLevel('');
    setBidRange({ min: '', max: '' });
    onFiltersChange?.({});
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filtros de Palavras-chave</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {showAdvanced ? 'Ocultar' : 'Avançado'}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Buscar palavra-chave"
            type="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            label="Tipo de correspondência"
            options={matchTypeOptions}
            value={matchType}
            onChange={setMatchType}
            placeholder="Selecione o tipo"
          />
          
          <Select
            label="Pontuação de qualidade"
            options={qualityScoreOptions}
            value={qualityScore}
            onChange={setQualityScore}
            placeholder="Selecione a pontuação"
          />
          
          <Select
            label="Nível de desempenho"
            options={performanceOptions}
            value={performanceLevel}
            onChange={setPerformanceLevel}
            placeholder="Selecione o nível"
          />
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Faixa de Lance (R$)</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={bidRange.min}
                    onChange={(e) => setBidRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">até</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={bidRange.max}
                    onChange={(e) => setBidRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">CTR Mínimo (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 2.5"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Conversões Mínimas</label>
                <Input
                  type="number"
                  placeholder="Ex: 10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              onClick={handleApplyFilters}
              iconName="Search"
              iconPosition="left"
            >
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Exportar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Atualizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordFilters;