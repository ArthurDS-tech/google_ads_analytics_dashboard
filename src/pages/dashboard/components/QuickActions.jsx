import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Nova Campanha',
      description: 'Criar uma nova campanha do zero',
      icon: 'Plus',
      color: 'primary',
      action: 'create_campaign'
    },
    {
      id: 2,
      title: 'Gerar Relatório',
      description: 'Relatório personalizado de performance',
      icon: 'FileText',
      color: 'accent',
      action: 'generate_report'
    },
    {
      id: 3,
      title: 'Otimizar Lances',
      description: 'Ajustar lances automaticamente',
      icon: 'TrendingUp',
      color: 'success',
      action: 'optimize_bids'
    },
    {
      id: 4,
      title: 'Pausar Campanhas',
      description: 'Operação em lote para múltiplas campanhas',
      icon: 'Pause',
      color: 'warning',
      action: 'bulk_pause'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
      success: 'bg-success text-success-foreground hover:bg-success/90',
      warning: 'bg-warning text-warning-foreground hover:bg-warning/90'
    };
    return colorMap[color] || colorMap.primary;
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create_campaign':
        window.location.href = '/campaign-management';
        break;
      case 'generate_report':
        window.location.href = '/reports';
        break;
      case 'optimize_bids':
        window.location.href = '/campaign-analytics';
        break;
      case 'bulk_pause':
        window.location.href = '/campaign-management';
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Ações Rápidas</h3>
        <p className="text-sm text-muted-foreground">Acesso direto às principais funcionalidades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.action)}
            className="group p-4 bg-muted rounded-lg border border-border hover:border-muted-foreground transition-all duration-200 hover:shadow-md text-left"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${getColorClasses(action.color)}`}>
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {action.description}
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary transition-colors duration-200 mt-1" 
              />
            </div>
          </button>
        ))}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Campanhas Ativas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">R$ 28.5k</p>
            <p className="text-xs text-muted-foreground">Gasto Mensal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">3.2%</p>
            <p className="text-xs text-muted-foreground">CTR Médio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;