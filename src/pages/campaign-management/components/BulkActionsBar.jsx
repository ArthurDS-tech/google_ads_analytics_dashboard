import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Selecionar ação...' },
    { value: 'pause', label: 'Pausar Campanhas' },
    { value: 'resume', label: 'Retomar Campanhas' },
    { value: 'delete', label: 'Excluir Campanhas' },
    { value: 'export', label: 'Exportar Dados' },
    { value: 'duplicate', label: 'Duplicar Campanhas' },
    { value: 'change_budget', label: 'Alterar Orçamento' }
  ];

  const handleExecuteAction = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-96">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              {selectedCount}
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedCount === 1 ? '1 campanha selecionada' : `${selectedCount} campanhas selecionadas`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Selecionar ação..."
              className="min-w-48"
            />

            <Button
              variant="default"
              size="sm"
              onClick={handleExecuteAction}
              disabled={!selectedAction}
              iconName="Play"
              iconPosition="left"
            >
              Executar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground mr-2">Ações rápidas:</span>
          
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onBulkAction('pause')}
            iconName="Pause"
            iconPosition="left"
          >
            Pausar
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onBulkAction('resume')}
            iconName="Play"
            iconPosition="left"
          >
            Retomar
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onBulkAction('export')}
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onBulkAction('delete')}
            iconName="Trash2"
            iconPosition="left"
            className="text-error hover:text-error"
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;