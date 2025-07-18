import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedReportItem = ({ report, onOpen, onDuplicate, onDelete, onSchedule }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-warning bg-warning/10';
      case 'generated':
        return 'text-success bg-success/10';
      case 'draft':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'generated':
        return 'Gerado';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="p-3 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-foreground text-sm mb-1">{report.name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            <Icon name="Circle" size={8} className="mr-1" />
            {getStatusText(report.status)}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpen(report)}
            className="h-7 w-7"
          >
            <Icon name="Eye" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(report)}
            className="h-7 w-7"
          >
            <Icon name="Copy" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(report)}
            className="h-7 w-7 text-error hover:text-error"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Modificado: {report.lastModified}</span>
        <div className="flex items-center space-x-2">
          {report.isScheduled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSchedule(report)}
              className="h-6 px-2 text-xs"
            >
              <Icon name="Calendar" size={12} className="mr-1" />
              Agendar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedReportItem;