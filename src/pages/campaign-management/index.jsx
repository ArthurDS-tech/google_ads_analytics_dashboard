import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CampaignFilters from './components/CampaignFilters';
import CampaignTable from './components/CampaignTable';
import BulkActionsBar from './components/BulkActionsBar';
import CampaignStats from './components/CampaignStats';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'last_30_days',
    performance: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock campaign data
  const mockCampaigns = [
    {
      id: 1,
      name: "Campanha Black Friday 2024",
      status: "active",
      type: "pesquisa",
      budget: 5000,
      spend: 3250.75,
      impressions: 125000,
      clicks: 3500,
      ctr: 2.8,
      cpc: 0.93,
      conversions: 87,
      lastModified: "2024-07-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Display - Produtos Eletrônicos",
      status: "paused",
      type: "display",
      budget: 2500,
      spend: 1875.50,
      impressions: 89000,
      clicks: 1200,
      ctr: 1.35,
      cpc: 1.56,
      conversions: 24,
      lastModified: "2024-07-14T15:45:00Z"
    },
    {
      id: 3,
      name: "Shopping - Roupas Femininas",
      status: "budget_limited",
      type: "shopping",
      budget: 3000,
      spend: 2999.99,
      impressions: 156000,
      clicks: 4200,
      ctr: 2.69,
      cpc: 0.71,
      conversions: 156,
      lastModified: "2024-07-18T09:15:00Z"
    },
    {
      id: 4,
      name: "Vídeo - Lançamento Produto",
      status: "active",
      type: "vídeo",
      budget: 8000,
      spend: 4567.25,
      impressions: 234000,
      clicks: 2800,
      ctr: 1.20,
      cpc: 1.63,
      conversions: 45,
      lastModified: "2024-07-17T14:20:00Z"
    },
    {
      id: 5,
      name: "App Install - Aplicativo Mobile",
      status: "active",
      type: "app",
      budget: 1500,
      spend: 987.30,
      impressions: 67000,
      clicks: 1850,
      ctr: 2.76,
      cpc: 0.53,
      conversions: 78,
      lastModified: "2024-07-16T11:00:00Z"
    },
    {
      id: 6,
      name: "Pesquisa - Serviços Locais",
      status: "paused",
      type: "pesquisa",
      budget: 2000,
      spend: 1234.67,
      impressions: 45000,
      clicks: 890,
      ctr: 1.98,
      cpc: 1.39,
      conversions: 32,
      lastModified: "2024-07-13T16:30:00Z"
    },
    {
      id: 7,
      name: "Display - Remarketing",
      status: "active",
      type: "display",
      budget: 1200,
      spend: 856.45,
      impressions: 78000,
      clicks: 1560,
      ctr: 2.00,
      cpc: 0.55,
      conversions: 67,
      lastModified: "2024-07-18T08:45:00Z"
    },
    {
      id: 8,
      name: "Shopping - Casa e Jardim",
      status: "ended",
      type: "shopping",
      budget: 4000,
      spend: 3890.12,
      impressions: 198000,
      clicks: 5200,
      ctr: 2.63,
      cpc: 0.75,
      conversions: 198,
      lastModified: "2024-07-10T12:00:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadCampaigns = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
      setFilteredCampaigns(mockCampaigns);
      setIsLoading(false);
    };

    loadCampaigns();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = campaigns;

    if (filters.status !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filters.status);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === filters.type);
    }

    if (filters.performance !== 'all') {
      switch (filters.performance) {
        case 'high_ctr':
          filtered = filtered.filter(campaign => campaign.ctr > 5);
          break;
        case 'low_ctr':
          filtered = filtered.filter(campaign => campaign.ctr < 2);
          break;
        case 'high_conversion':
          filtered = filtered.filter(campaign => (campaign.conversions / campaign.clicks) * 100 > 10);
          break;
        case 'low_conversion':
          filtered = filtered.filter(campaign => (campaign.conversions / campaign.clicks) * 100 < 2);
          break;
        case 'over_budget':
          filtered = filtered.filter(campaign => campaign.spend >= campaign.budget * 0.9);
          break;
        default:
          break;
      }
    }

    if (filters.search) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedCampaigns([]); // Clear selection when filters change
  };

  const handleCampaignClick = (campaign) => {
    // Navigate to campaign details
    console.log('Navigate to campaign details:', campaign.id);
    // In a real app: navigate(`/campaign-analytics/${campaign.id}`);
  };

  const handleBulkAction = (action, campaignIds = selectedCampaigns) => {
    console.log('Bulk action:', action, 'on campaigns:', campaignIds);
    
    switch (action) {
      case 'pause':
        setCampaigns(prev => prev.map(campaign => 
          campaignIds.includes(campaign.id) 
            ? { ...campaign, status: 'paused' }
            : campaign
        ));
        break;
      case 'resume':
        setCampaigns(prev => prev.map(campaign => 
          campaignIds.includes(campaign.id) 
            ? { ...campaign, status: 'active' }
            : campaign
        ));
        break;
      case 'delete':
        if (window.confirm(`Tem certeza que deseja excluir ${campaignIds.length} campanha(s)?`)) {
          setCampaigns(prev => prev.filter(campaign => !campaignIds.includes(campaign.id)));
        }
        break;
      case 'export':
        // Simulate export
        alert('Exportando dados das campanhas selecionadas...');
        break;
      case 'duplicate':
        // Simulate duplication
        alert('Duplicando campanhas selecionadas...');
        break;
      case 'change_budget':
        // Simulate budget change
        alert('Abrindo modal para alterar orçamento...');
        break;
      case 'edit':
        // Navigate to edit page
        console.log('Navigate to edit campaign:', campaignIds[0]);
        break;
      default:
        break;
    }
    
    setSelectedCampaigns([]);
  };

  const handleNewCampaign = () => {
    console.log('Navigate to new campaign creation');
    // In a real app: navigate('/campaign-management/new');
  };

  const handleExportAll = () => {
    console.log('Export all campaigns');
    alert('Exportando todas as campanhas...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando campanhas...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gerenciamento de Campanhas
              </h1>
              <p className="text-muted-foreground">
                Visualize, organize e gerencie suas campanhas do Google Ads
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={handleExportAll}
                iconName="Download"
                iconPosition="left"
              >
                Exportar Tudo
              </Button>
              
              <Button
                variant="default"
                onClick={handleNewCampaign}
                iconName="Plus"
                iconPosition="left"
              >
                Nova Campanha
              </Button>
            </div>
          </div>

          {/* Campaign Statistics */}
          <CampaignStats campaigns={filteredCampaigns} />

          {/* Filters */}
          <CampaignFilters 
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredCampaigns.length} de {campaigns.length} campanhas
            </div>
            
            {selectedCampaigns.length > 0 && (
              <div className="text-sm text-primary font-medium">
                {selectedCampaigns.length} campanha(s) selecionada(s)
              </div>
            )}
          </div>

          {/* Campaign Table */}
          <CampaignTable
            campaigns={filteredCampaigns}
            onCampaignClick={handleCampaignClick}
            onBulkAction={handleBulkAction}
            selectedCampaigns={selectedCampaigns}
            onSelectionChange={setSelectedCampaigns}
          />

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedCampaigns.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedCampaigns([])}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignManagement;