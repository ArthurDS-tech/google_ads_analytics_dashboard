import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import KeywordSummaryCards from './components/KeywordSummaryCards';
import KeywordFilters from './components/KeywordFilters';
import KeywordDataTable from './components/KeywordDataTable';
import KeywordSidebar from './components/KeywordSidebar';

const KeywordPerformance = () => {
  const [filters, setFilters] = useState({});

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // In a real application, this would trigger data refetch
    console.log('Filters applied:', newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Análise de Palavras-chave
                </h1>
                <p className="text-muted-foreground">
                  Monitore e otimize o desempenho das suas palavras-chave para maximizar o ROI das campanhas
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Última atualização</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <KeywordSummaryCards />

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Filters and Table */}
            <div className="xl:col-span-3 space-y-6">
              <KeywordFilters onFiltersChange={handleFiltersChange} />
              <KeywordDataTable />
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-1">
              <KeywordSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KeywordPerformance;