import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Orçamento Quase Esgotado',
      message: 'Campanha "Black Friday 2024" atingiu 90% do orçamento diário',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      campaign: 'Black Friday 2024',
      isRead: false,
      action: 'increase_budget'
    },
    {
      id: 2,
      type: 'error',
      title: 'CPC Muito Alto',
      message: 'Palavras-chave com CPC acima de R$ 15,00 detectadas',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      campaign: 'Produtos Eletrônicos',
      isRead: false,
      action: 'optimize_keywords'
    },
    {
      id: 3,
      type: 'success',
      title: 'Meta de Conversão Atingida',
      message: 'Campanha superou a meta mensal em 15%',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      campaign: 'Remarketing - Carrinho',
      isRead: true,
      action: 'view_report'
    },
    {
      id: 4,
      type: 'info',
      title: 'Novo Relatório Disponível',
      message: 'Relatório semanal de performance foi gerado',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      campaign: null,
      isRead: true,
      action: 'view_report'
    },
    {
      id: 5,
      type: 'warning',
      title: 'CTR Abaixo da Média',
      message: 'Taxa de cliques 25% abaixo da média do setor',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      campaign: 'Lançamento Produto',
      isRead: false,
      action: 'optimize_ads'
    }
  ]);

  const getAlertIcon = (type) => {
    const iconMap = {
      warning: 'AlertTriangle',
      error: 'AlertCircle',
      success: 'CheckCircle',
      info: 'Info'
    };
    return iconMap[type] || 'Bell';
  };

  const getAlertColor = (type) => {
    const colorMap = {
      warning: 'text-warning',
      error: 'text-error',
      success: 'text-success',
      info: 'text-primary'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const getAlertBgColor = (type) => {
    const bgMap = {
      warning: 'bg-warning/10',
      error: 'bg-error/10',
      success: 'bg-success/10',
      info: 'bg-primary/10'
    };
    return bgMap[type] || 'bg-muted';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return `${days}d atrás`;
    }
  };

  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleAlertAction = (alert) => {
    switch (alert.action) {
      case 'increase_budget':
        window.location.href = '/campaign-management';
        break;
      case 'optimize_keywords':
        window.location.href = '/keyword-performance';
        break;
      case 'view_report':
        window.location.href = '/reports';
        break;
      case 'optimize_ads':
        window.location.href = '/campaign-analytics';
        break;
      default:
        break;
    }
  };

  const handleViewAllAlerts = () => {
    // In a real app, this would navigate to a dedicated alerts page
    console.log('View all alerts');
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Alertas Recentes</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lidos` : 'Todos os alertas lidos'}
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleViewAllAlerts}>
          Ver Todos
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              alert.isRead 
                ? 'bg-muted/50 border-border' 
                : `${getAlertBgColor(alert.type)} border-border`
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAlertBgColor(alert.type)}`}>
                <Icon name={getAlertIcon(alert.type)} size={16} className={getAlertColor(alert.type)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${alert.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {alert.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
                
                <p className={`text-sm mb-2 ${alert.isRead ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  {alert.message}
                </p>
                
                {alert.campaign && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Target" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{alert.campaign}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAlertAction(alert)}
                    className="text-xs h-7 px-3"
                  >
                    {alert.action === 'increase_budget' && 'Ajustar Orçamento'}
                    {alert.action === 'optimize_keywords' && 'Otimizar Palavras'}
                    {alert.action === 'view_report' && 'Ver Relatório'}
                    {alert.action === 'optimize_ads' && 'Otimizar Anúncios'}
                  </Button>
                  
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-xs h-7 px-3 text-muted-foreground hover:text-foreground"
                    >
                      Marcar como Lido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;