import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportBuilder = ({ selectedTemplate, onSave, onGenerate }) => {
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [reportWidgets, setReportWidgets] = useState(selectedTemplate?.widgets || []);

  const availableWidgets = [
    { id: 'campaign-overview', name: 'Visão Geral de Campanhas', icon: 'BarChart3', type: 'chart' },
    { id: 'keyword-performance', name: 'Performance de Palavras-chave', icon: 'Hash', type: 'table' },
    { id: 'geographic-analysis', name: 'Análise Geográfica', icon: 'MapPin', type: 'map' },
    { id: 'roi-summary', name: 'Resumo de ROI', icon: 'TrendingUp', type: 'metric' },
    { id: 'cost-analysis', name: 'Análise de Custos', icon: 'DollarSign', type: 'chart' },
    { id: 'conversion-funnel', name: 'Funil de Conversão', icon: 'Filter', type: 'funnel' },
    { id: 'device-performance', name: 'Performance por Dispositivo', icon: 'Smartphone', type: 'chart' },
    { id: 'time-analysis', name: 'Análise Temporal', icon: 'Clock', type: 'timeline' }
  ];

  const handleDragStart = (e, widget) => {
    setDraggedWidget(widget);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedWidget && !reportWidgets.find(w => w.id === draggedWidget.id)) {
      setReportWidgets([...reportWidgets, { ...draggedWidget, position: reportWidgets.length }]);
    }
    setDraggedWidget(null);
  };

  const removeWidget = (widgetId) => {
    setReportWidgets(reportWidgets.filter(w => w.id !== widgetId));
  };

  const moveWidget = (widgetId, direction) => {
    const currentIndex = reportWidgets.findIndex(w => w.id === widgetId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= reportWidgets.length) return;

    const newWidgets = [...reportWidgets];
    [newWidgets[currentIndex], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[currentIndex]];
    setReportWidgets(newWidgets);
  };

  if (!selectedTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Selecione um Template</h3>
          <p className="text-muted-foreground">Escolha um template da lista ao lado para começar a construir seu relatório</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Construtor de Relatório</h2>
          <p className="text-sm text-muted-foreground">Template: {selectedTemplate.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Salvar
          </Button>
          <Button onClick={onGenerate}>
            <Icon name="FileText" size={16} className="mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Widget Library */}
        <div className="w-64 border-r border-border p-4">
          <h3 className="font-medium text-foreground mb-3">Widgets Disponíveis</h3>
          <div className="space-y-2">
            {availableWidgets.map((widget) => (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
                className="p-3 border border-border rounded-lg cursor-move hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={widget.icon} size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{widget.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{widget.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Canvas */}
        <div className="flex-1 p-4">
          <div
            className="h-full border-2 border-dashed border-border rounded-lg p-4 bg-card"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h3 className="font-medium text-foreground mb-4">Prévia do Relatório</h3>
            
            {reportWidgets.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-center">
                <div>
                  <Icon name="MousePointer" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Arraste widgets da biblioteca para construir seu relatório</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reportWidgets.map((widget, index) => (
                  <div key={widget.id} className="border border-border rounded-lg p-4 bg-background">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon name={widget.icon} size={16} className="text-primary" />
                        <span className="font-medium text-foreground">{widget.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveWidget(widget.id, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7"
                        >
                          <Icon name="ChevronUp" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveWidget(widget.id, 'down')}
                          disabled={index === reportWidgets.length - 1}
                          className="h-7 w-7"
                        >
                          <Icon name="ChevronDown" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWidget(widget.id)}
                          className="h-7 w-7 text-error hover:text-error"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Widget Preview */}
                    <div className="h-32 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <div className="text-center">
                        <Icon name={widget.icon} size={24} className="text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Prévia: {widget.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;