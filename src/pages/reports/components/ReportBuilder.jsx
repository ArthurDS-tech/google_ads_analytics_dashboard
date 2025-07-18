import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import exportService from '../../../services/exportService';
import reportService from '../../../services/reportService';

const ReportBuilder = ({ selectedTemplate, onSave, onGenerate }) => {
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [reportWidgets, setReportWidgets] = useState(selectedTemplate?.widgets || []);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [exportFormats, setExportFormats] = useState([]);

  const availableWidgets = [
    { id: 'campaign-overview', name: 'Visão Geral de Campanhas', icon: 'BarChart3', type: 'chart', description: 'Métricas principais de campanhas' },
    { id: 'keyword-performance', name: 'Performance de Palavras-chave', icon: 'Hash', type: 'table', description: 'Análise detalhada de palavras-chave' },
    { id: 'geographic-analysis', name: 'Análise Geográfica', icon: 'MapPin', type: 'map', description: 'Performance por região' },
    { id: 'roi-summary', name: 'Resumo de ROI', icon: 'TrendingUp', type: 'metric', description: 'Retorno sobre investimento' },
    { id: 'cost-analysis', name: 'Análise de Custos', icon: 'DollarSign', type: 'chart', description: 'Análise de gastos por período' },
    { id: 'conversion-funnel', name: 'Funil de Conversão', icon: 'Filter', type: 'funnel', description: 'Funil de conversão detalhado' },
    { id: 'device-performance', name: 'Performance por Dispositivo', icon: 'Smartphone', type: 'chart', description: 'Comparação entre dispositivos' },
    { id: 'time-analysis', name: 'Análise Temporal', icon: 'Clock', type: 'timeline', description: 'Performance ao longo do tempo' },
    { id: 'competitor-analysis', name: 'Análise de Concorrentes', icon: 'Users', type: 'table', description: 'Comparação com concorrentes' },
    { id: 'quality-score', name: 'Quality Score', icon: 'Star', type: 'metric', description: 'Pontuação de qualidade' }
  ];

  useEffect(() => {
    loadExportFormats();
  }, []);

  useEffect(() => {
    if (selectedTemplate?.widgets) {
      setReportWidgets(selectedTemplate.widgets);
    }
  }, [selectedTemplate]);

  const loadExportFormats = async () => {
    try {
      const formats = exportService.getSupportedFormats();
      setExportFormats(formats);
    } catch (error) {
      console.error('Error loading export formats:', error);
    }
  };

  const handleDragStart = (e, widget) => {
    setDraggedWidget(widget);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widget.id);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setIsDragging(false);
    setDragOverIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only reset if we're leaving the drop zone completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex = null) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (draggedWidget) {
      const existingWidget = reportWidgets.find(w => w.id === draggedWidget.id);
      
      if (!existingWidget) {
        const newWidget = { 
          ...draggedWidget, 
          position: dropIndex !== null ? dropIndex : reportWidgets.length,
          widgetId: `${draggedWidget.id}_${Date.now()}`
        };
        
        if (dropIndex !== null) {
          const newWidgets = [...reportWidgets];
          newWidgets.splice(dropIndex, 0, newWidget);
          setReportWidgets(newWidgets.map((w, index) => ({ ...w, position: index })));
        } else {
          setReportWidgets([...reportWidgets, newWidget]);
        }
      }
    }
    
    setDraggedWidget(null);
    setIsDragging(false);
  };

  const removeWidget = (widgetId) => {
    setReportWidgets(reportWidgets.filter(w => w.widgetId !== widgetId));
  };

  const moveWidget = (widgetId, direction) => {
    const currentIndex = reportWidgets.findIndex(w => w.widgetId === widgetId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= reportWidgets.length) return;

    const newWidgets = [...reportWidgets];
    [newWidgets[currentIndex], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[currentIndex]];
    setReportWidgets(newWidgets.map((w, index) => ({ ...w, position: index })));
  };

  const duplicateWidget = (widgetId) => {
    const widget = reportWidgets.find(w => w.widgetId === widgetId);
    if (widget) {
      const duplicatedWidget = {
        ...widget,
        widgetId: `${widget.id}_${Date.now()}`,
        position: reportWidgets.length
      };
      setReportWidgets([...reportWidgets, duplicatedWidget]);
    }
  };

  const handleGeneratePreview = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      const config = {
        widgets: reportWidgets,
        limit: 10 // Preview limit
      };
      
      const preview = await reportService.getReportPreview(selectedTemplate.id, config);
      setPreviewData(preview);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format) => {
    if (!previewData) return;
    
    try {
      const filename = exportService.generateFilename(selectedTemplate?.name || 'report', format);
      
      switch (format) {
        case 'csv':
          await exportService.exportToCSV(previewData.data, filename);
          break;
        case 'xlsx':
          await exportService.exportToExcel(previewData.data, filename);
          break;
        case 'pdf':
          await exportService.exportToPDF(previewData.data, filename, {
            title: selectedTemplate?.name || 'Report'
          });
          break;
        case 'json':
          await exportService.exportToJSON(previewData, filename);
          break;
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
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
          <Button variant="outline" onClick={handleGeneratePreview} disabled={isGenerating}>
            <Icon name="Eye" size={16} className="mr-2" />
            {isGenerating ? 'Gerando...' : 'Prévia'}
          </Button>
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
        <div className="w-64 border-r border-border p-4 bg-background">
          <h3 className="font-medium text-foreground mb-3">Widgets Disponíveis</h3>
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {availableWidgets.map((widget) => (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
                onDragEnd={handleDragEnd}
                className={`p-3 border border-border rounded-lg cursor-move hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 ${
                  isDragging && draggedWidget?.id === widget.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start space-x-2">
                  <Icon name={widget.icon} size={16} className="text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{widget.name}</p>
                    <p className="text-xs text-muted-foreground mb-1">{widget.description}</p>
                    <span className="text-xs bg-muted px-2 py-1 rounded capitalize">{widget.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Canvas */}
        <div className="flex-1 p-4 bg-muted/10">
          <div
            className="h-full border-2 border-dashed border-border rounded-lg p-4 bg-card"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e)}
            onDragEnter={(e) => handleDragEnter(e, null)}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Prévia do Relatório</h3>
              {previewData && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Exportar como:</span>
                  {exportFormats.map((format) => (
                    <Button
                      key={format.format}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(format.format)}
                      title={format.description}
                    >
                      {format.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {reportWidgets.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-center">
                <div>
                  <Icon name="MousePointer" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Arraste widgets da biblioteca para construir seu relatório</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
                {reportWidgets.map((widget, index) => (
                  <div
                    key={widget.widgetId}
                    className={`border border-border rounded-lg p-4 bg-background relative ${
                      dragOverIndex === index ? 'border-primary border-2' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                  >
                    {dragOverIndex === index && (
                      <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none"></div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon name={widget.icon} size={16} className="text-primary" />
                        <span className="font-medium text-foreground">{widget.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded capitalize">{widget.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveWidget(widget.widgetId, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7"
                          title="Mover para cima"
                        >
                          <Icon name="ChevronUp" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveWidget(widget.widgetId, 'down')}
                          disabled={index === reportWidgets.length - 1}
                          className="h-7 w-7"
                          title="Mover para baixo"
                        >
                          <Icon name="ChevronDown" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => duplicateWidget(widget.widgetId)}
                          className="h-7 w-7"
                          title="Duplicar"
                        >
                          <Icon name="Copy" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWidget(widget.widgetId)}
                          className="h-7 w-7 text-error hover:text-error"
                          title="Remover"
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
                        {widget.description && (
                          <p className="text-xs text-muted-foreground/70 mt-1">{widget.description}</p>
                        )}
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