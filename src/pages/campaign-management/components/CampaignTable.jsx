import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import CampaignStatusBadge from './CampaignStatusBadge';

const CampaignTable = ({ campaigns, onCampaignClick, onBulkAction, selectedCampaigns, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedCampaigns = () => {
    if (!sortConfig.key) return campaigns;

    return [...campaigns].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(campaigns.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCampaign = (campaignId, checked) => {
    if (checked) {
      onSelectionChange([...selectedCampaigns, campaignId]);
    } else {
      onSelectionChange(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const isAllSelected = campaigns.length > 0 && selectedCampaigns.length === campaigns.length;
  const isPartiallySelected = selectedCampaigns.length > 0 && selectedCampaigns.length < campaigns.length;

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-primary' : 'text-muted-foreground'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  const sortedCampaigns = getSortedCampaigns();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <SortableHeader label="Nome da Campanha" sortKey="name" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Tipo" sortKey="type" />
              <SortableHeader label="Orçamento" sortKey="budget" />
              <SortableHeader label="Gasto" sortKey="spend" />
              <SortableHeader label="Impressões" sortKey="impressions" />
              <SortableHeader label="Cliques" sortKey="clicks" />
              <SortableHeader label="CTR" sortKey="ctr" />
              <SortableHeader label="CPC" sortKey="cpc" />
              <SortableHeader label="Conversões" sortKey="conversions" />
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={(e) => handleSelectCampaign(campaign.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onCampaignClick(campaign)}
                    className="text-primary hover:text-primary/80 font-medium text-left"
                  >
                    {campaign.name}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 text-sm text-foreground capitalize">
                  {campaign.type}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatCurrency(campaign.spend)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatNumber(campaign.impressions)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatNumber(campaign.clicks)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatPercentage(campaign.ctr)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {formatCurrency(campaign.cpc)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {campaign.conversions}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onBulkAction('edit', [campaign.id])}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onBulkAction(campaign.status === 'active' ? 'pause' : 'resume', [campaign.id])}
                      className="h-8 w-8"
                    >
                      <Icon name={campaign.status === 'active' ? 'Pause' : 'Play'} size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onBulkAction('delete', [campaign.id])}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedCampaigns.includes(campaign.id)}
                  onChange={(e) => handleSelectCampaign(campaign.id, e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <button
                    onClick={() => onCampaignClick(campaign)}
                    className="text-primary hover:text-primary/80 font-medium text-left"
                  >
                    {campaign.name}
                  </button>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {campaign.type}
                  </p>
                </div>
              </div>
              <CampaignStatusBadge status={campaign.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Orçamento</p>
                <p className="text-sm font-medium">{formatCurrency(campaign.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gasto</p>
                <p className="text-sm font-medium">{formatCurrency(campaign.spend)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cliques</p>
                <p className="text-sm font-medium">{formatNumber(campaign.clicks)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CTR</p>
                <p className="text-sm font-medium">{formatPercentage(campaign.ctr)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {campaign.conversions} conversões
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction('edit', [campaign.id])}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction(campaign.status === 'active' ? 'pause' : 'resume', [campaign.id])}
                  iconName={campaign.status === 'active' ? 'Pause' : 'Play'}
                  iconPosition="left"
                >
                  {campaign.status === 'active' ? 'Pausar' : 'Retomar'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros ou criar uma nova campanha.</p>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;