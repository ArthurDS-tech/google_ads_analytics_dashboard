import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeywordTable = ({ data }) => {
  const [sortField, setSortField] = useState('impressions');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getPerformanceColor = (ctr) => {
    if (ctr >= 5) return 'text-success';
    if (ctr >= 2) return 'text-warning';
    return 'text-error';
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    return sortDirection === 'asc' ? 
      <Icon name="ArrowUp" size={14} className="text-primary" /> : 
      <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance de Palavras-chave</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Exportar
          </Button>
          <Button variant="outline" size="sm" iconName="Filter">
            Filtrar
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('keyword')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Palavra-chave</span>
                  <SortIcon field="keyword" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('impressions')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Impressões</span>
                  <SortIcon field="impressions" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('clicks')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Cliques</span>
                  <SortIcon field="clicks" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('ctr')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>CTR</span>
                  <SortIcon field="ctr" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('cost')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Custo</span>
                  <SortIcon field="cost" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('conversions')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground ml-auto"
                >
                  <span>Conversões</span>
                  <SortIcon field="conversions" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((keyword) => (
              <tr key={keyword.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{keyword.keyword}</span>
                    {keyword.isNew && (
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        Novo
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-sm text-foreground">
                  {formatNumber(keyword.impressions)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-foreground">
                  {formatNumber(keyword.clicks)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`text-sm font-medium ${getPerformanceColor(keyword.ctr)}`}>
                    {keyword.ctr.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-sm text-foreground">
                  {formatCurrency(keyword.cost)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-foreground">
                  {formatNumber(keyword.conversions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              iconName="ChevronLeft"
            >
              Anterior
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordTable;