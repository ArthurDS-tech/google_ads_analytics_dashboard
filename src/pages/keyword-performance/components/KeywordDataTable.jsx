import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const KeywordDataTable = () => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const keywordData = [
    {
      id: 1,
      keyword: "marketing digital",
      matchType: "exact",
      searchVolume: 12500,
      competition: "Alta",
      avgCpc: 3.45,
      impressions: 45230,
      clicks: 1250,
      ctr: 2.76,
      qualityScore: 8,
      conversions: 45,
      conversionRate: 3.6,
      cost: 4312.50,
      status: "active"
    },
    {
      id: 2,
      keyword: "agência de publicidade",
      matchType: "phrase",
      searchVolume: 8900,
      competition: "Média",
      avgCpc: 2.89,
      impressions: 32100,
      clicks: 890,
      ctr: 2.77,
      qualityScore: 7,
      conversions: 28,
      conversionRate: 3.1,
      cost: 2572.10,
      status: "active"
    },
    {
      id: 3,
      keyword: "google ads",
      matchType: "broad",
      searchVolume: 22000,
      competition: "Alta",
      avgCpc: 4.12,
      impressions: 67800,
      clicks: 1890,
      ctr: 2.79,
      qualityScore: 9,
      conversions: 89,
      conversionRate: 4.7,
      cost: 7786.80,
      status: "active"
    },
    {
      id: 4,
      keyword: "ppc campanha",
      matchType: "exact",
      searchVolume: 5600,
      competition: "Baixa",
      avgCpc: 1.95,
      impressions: 18900,
      clicks: 567,
      ctr: 3.0,
      qualityScore: 6,
      conversions: 15,
      conversionRate: 2.6,
      cost: 1105.65,
      status: "paused"
    },
    {
      id: 5,
      keyword: "otimização de campanhas",
      matchType: "phrase",
      searchVolume: 3200,
      competition: "Média",
      avgCpc: 2.67,
      impressions: 12400,
      clicks: 345,
      ctr: 2.78,
      qualityScore: 7,
      conversions: 12,
      conversionRate: 3.5,
      cost: 921.15,
      status: "active"
    }
  ];

  const getMatchTypeColor = (type) => {
    switch (type) {
      case 'exact': return 'bg-success/10 text-success';
      case 'phrase': return 'bg-warning/10 text-warning';
      case 'broad': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMatchTypeLabel = (type) => {
    switch (type) {
      case 'exact': return 'Exata';
      case 'phrase': return 'Frase';
      case 'broad': return 'Ampla';
      default: return type;
    }
  };

  const getCompetitionColor = (competition) => {
    switch (competition) {
      case 'Alta': return 'text-error';
      case 'Média': return 'text-warning';
      case 'Baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityScoreColor = (score) => {
    if (score >= 7) return 'text-success';
    if (score >= 4) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceIndicator = (ctr, qualityScore) => {
    if (ctr >= 3.0 && qualityScore >= 7) return { color: 'text-success', icon: 'TrendingUp' };
    if (ctr >= 2.0 && qualityScore >= 5) return { color: 'text-warning', icon: 'Minus' };
    return { color: 'text-error', icon: 'TrendingDown' };
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedKeywords(keywordData.map(item => item.id));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectKeyword = (id, checked) => {
    if (checked) {
      setSelectedKeywords(prev => [...prev, id]);
    } else {
      setSelectedKeywords(prev => prev.filter(item => item !== id));
    }
  };

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
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {selectedKeywords.length > 0 
                ? `${selectedKeywords.length} selecionada(s)` 
                : `${keywordData.length} palavras-chave`
              }
            </span>
            {selectedKeywords.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
                  Editar Lances
                </Button>
                <Button variant="outline" size="sm" iconName="Pause" iconPosition="left">
                  Pausar
                </Button>
                <Button variant="outline" size="sm" iconName="Trash2" iconPosition="left">
                  Remover
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Filter" iconPosition="left">
              Filtrar
            </Button>
            <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedKeywords.length === keywordData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('keyword')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Palavra-chave</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Tipo</th>
              <th className="text-right p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('searchVolume')}
                  className="flex items-center space-x-1 hover:text-primary ml-auto"
                >
                  <span>Volume</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Concorrência</th>
              <th className="text-right p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('avgCpc')}
                  className="flex items-center space-x-1 hover:text-primary ml-auto"
                >
                  <span>CPC Médio</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right p-4 font-medium text-foreground">Impressões</th>
              <th className="text-right p-4 font-medium text-foreground">Cliques</th>
              <th className="text-right p-4 font-medium text-foreground">CTR</th>
              <th className="text-center p-4 font-medium text-foreground">Qualidade</th>
              <th className="text-right p-4 font-medium text-foreground">Conversões</th>
              <th className="text-right p-4 font-medium text-foreground">Custo</th>
              <th className="text-center p-4 font-medium text-foreground">Status</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {keywordData.map((keyword) => {
              const performance = getPerformanceIndicator(keyword.ctr, keyword.qualityScore);
              return (
                <tr key={keyword.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedKeywords.includes(keyword.id)}
                      onChange={(e) => handleSelectKeyword(keyword.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={performance.icon} size={16} className={performance.color} />
                      <span className="font-medium text-foreground">{keyword.keyword}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchTypeColor(keyword.matchType)}`}>
                      {getMatchTypeLabel(keyword.matchType)}
                    </span>
                  </td>
                  <td className="p-4 text-right text-foreground">
                    {formatNumber(keyword.searchVolume)}
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${getCompetitionColor(keyword.competition)}`}>
                      {keyword.competition}
                    </span>
                  </td>
                  <td className="p-4 text-right text-foreground font-medium">
                    {formatCurrency(keyword.avgCpc)}
                  </td>
                  <td className="p-4 text-right text-foreground">
                    {formatNumber(keyword.impressions)}
                  </td>
                  <td className="p-4 text-right text-foreground">
                    {formatNumber(keyword.clicks)}
                  </td>
                  <td className="p-4 text-right text-foreground">
                    {formatPercentage(keyword.ctr)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${getQualityScoreColor(keyword.qualityScore)}`}>
                      {keyword.qualityScore}/10
                    </span>
                  </td>
                  <td className="p-4 text-right text-foreground">
                    <div>
                      <span className="font-medium">{keyword.conversions}</span>
                      <span className="text-xs text-muted-foreground block">
                        ({formatPercentage(keyword.conversionRate)})
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-foreground font-medium">
                    {formatCurrency(keyword.cost)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      keyword.status === 'active' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {keyword.status === 'active' ? 'Ativa' : 'Pausada'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon">
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Mostrando 1-{Math.min(itemsPerPage, keywordData.length)} de {keywordData.length} resultados
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordDataTable;