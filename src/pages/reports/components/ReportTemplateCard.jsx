import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportTemplateCard = ({ template, onSelect, onPreview, isSelected }) => {
  return (
    <div className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={template.icon} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="h-8 w-8"
          >
            <Icon name="Eye" size={16} />
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {template.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="BarChart3" size={12} />
            <span>{template.metrics} métricas</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{template.lastUsed}</span>
          </span>
        </div>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(template)}
        >
          {isSelected ? 'Selecionado' : 'Usar Template'}
        </Button>
      </div>
    </div>
  );
};

export default ReportTemplateCard;