import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountSelector = () => {
  const [selectedAccount, setSelectedAccount] = useState('main');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const accounts = [
    {
      id: 'main',
      name: 'Conta Principal',
      customerId: '123-456-7890',
      currency: 'BRL',
      status: 'active',
      campaigns: 47,
      monthlySpend: 28500
    },
    {
      id: 'client1',
      name: 'Cliente - Loja Virtual',
      customerId: '234-567-8901',
      currency: 'BRL',
      status: 'active',
      campaigns: 23,
      monthlySpend: 15200
    },
    {
      id: 'client2',
      name: 'Cliente - Serviços',
      customerId: '345-678-9012',
      currency: 'BRL',
      status: 'active',
      campaigns: 12,
      monthlySpend: 8900
    },
    {
      id: 'test',
      name: 'Conta de Teste',
      customerId: '456-789-0123',
      currency: 'BRL',
      status: 'test',
      campaigns: 5,
      monthlySpend: 500
    }
  ];

  const currentAccount = accounts.find(acc => acc.id === selectedAccount);

  const handleAccountChange = (accountId) => {
    setSelectedAccount(accountId);
    setIsDropdownOpen(false);
    // In a real app, this would trigger a data refresh for the new account
    console.log('Switching to account:', accountId);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      active: 'text-success',
      test: 'text-warning',
      inactive: 'text-error'
    };
    return statusMap[status] || 'text-muted-foreground';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      active: 'Ativa',
      test: 'Teste',
      inactive: 'Inativa'
    };
    return labelMap[status] || 'Desconhecido';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Conta Selecionada</h3>
        <p className="text-sm text-muted-foreground">Gerencie múltiplas contas Google Ads</p>
      </div>

      {/* Current Account Display */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-4 bg-muted rounded-lg border border-border hover:border-muted-foreground transition-colors duration-200 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building" size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{currentAccount?.name}</p>
                <p className="text-xs text-muted-foreground">ID: {currentAccount?.customerId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${getStatusColor(currentAccount?.status)}`}>
                {getStatusLabel(currentAccount?.status)}
              </span>
              <Icon 
                name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            ></div>
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountChange(account.id)}
                  className={`w-full p-4 text-left hover:bg-muted transition-colors duration-200 border-b border-border last:border-b-0 ${
                    selectedAccount === account.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        account.status === 'active' ? 'bg-success' : 
                        account.status === 'test' ? 'bg-warning' : 'bg-error'
                      }`}>
                        <Icon name="Building" size={16} color="white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{account.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {account.customerId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">
                        {account.campaigns} campanhas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R$ {account.monthlySpend.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Account Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Campanhas Ativas</p>
            <p className="text-xl font-bold text-foreground">{currentAccount?.campaigns}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Gasto Mensal</p>
            <p className="text-xl font-bold text-foreground">
              R$ {currentAccount?.monthlySpend.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Account Actions */}
      <div className="mt-6 space-y-2">
        <Button variant="outline" size="sm" fullWidth>
          <Icon name="Settings" size={16} className="mr-2" />
          Configurações da Conta
        </Button>
        <Button variant="ghost" size="sm" fullWidth>
          <Icon name="Plus" size={16} className="mr-2" />
          Adicionar Nova Conta
        </Button>
      </div>
    </div>
  );
};

export default AccountSelector;