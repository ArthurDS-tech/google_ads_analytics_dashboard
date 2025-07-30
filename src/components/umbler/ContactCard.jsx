import React from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ContactCard = ({ 
  contact, 
  onChatClick, 
  onViewClick, 
  onMoreClick,
  showLastMessage = false 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success text-success-foreground';
      case 'aguardando':
        return 'bg-warning text-warning-foreground';
      case 'encerrado':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'aguardando':
        return 'Aguardando';
      case 'encerrado':
        return 'Encerrado';
      default:
        return 'Novo';
    }
  };

  const getEtiquetaColor = (etiqueta) => {
    const colorMap = {
      'BMW VEICULOS': 'bg-blue-100 text-blue-800 border-blue-200',
      'BMW MOTOS': 'bg-red-100 text-red-800 border-red-200',
      'BMW MINI COOPER': 'bg-green-100 text-green-800 border-green-200',
      'SUPORTE': 'bg-purple-100 text-purple-800 border-purple-200',
      'Qualificação': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Orçamento Enviado': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'thiago': 'bg-pink-100 text-pink-800 border-pink-200',
      'Maju': 'bg-teal-100 text-teal-800 border-teal-200',
      'Ana': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pendente': 'bg-amber-100 text-amber-800 border-amber-200',
      'Realizado': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Não realizado': 'bg-rose-100 text-rose-800 border-rose-200',
      'Sem tag': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[etiqueta] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIndicator = (status) => {
    const baseClasses = "w-3 h-3 rounded-full border-2 border-white";
    
    switch (status) {
      case 'online':
        return `${baseClasses} bg-success`;
      case 'aguardando':
        return `${baseClasses} bg-warning`;
      case 'encerrado':
        return `${baseClasses} bg-muted`;
      default:
        return `${baseClasses} bg-primary`;
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-all duration-200 hover:shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Avatar com indicador de status */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-sm">
              {contact.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 ${getStatusIndicator(contact.status)}`} />
          </div>
          
          {/* Info do Cliente */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {contact.nome}
              </h3>
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getEtiquetaColor(contact.etiqueta)} flex-shrink-0`}>
                {contact.etiqueta}
              </span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(contact.status)} flex-shrink-0`}>
                {getStatusText(contact.status)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <Icon name="Phone" size={14} />
                <span className="truncate">{contact.telefone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MessageSquare" size={14} />
                <span>{contact.origem}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span className="whitespace-nowrap">{contact.ultimoContato}</span>
              </div>
            </div>

            {/* Última mensagem (se disponível) */}
            {showLastMessage && contact.lastMessage && (
              <div className="bg-muted/50 rounded-md p-2 mt-2">
                <div className="flex items-start space-x-2">
                  <Icon 
                    name={contact.lastMessage.direction === 'outbound' ? 'ArrowUpRight' : 'ArrowDownLeft'} 
                    size={12} 
                    className={contact.lastMessage.direction === 'outbound' ? 'text-primary' : 'text-success'} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                      {contact.lastMessage.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contact.lastMessage.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onChatClick(contact)}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Icon name="MessageCircle" size={16} className="mr-1" />
            Chat
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewClick(contact)}
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Icon name="Eye" size={16} className="mr-1" />
            Ver
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMoreClick(contact)}
            className="hover:bg-muted"
          >
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        </div>
      </div>

      {/* Barra de progresso ou indicadores adicionais */}
      {contact.messageCount && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{contact.messageCount} mensagens</span>
            {contact.unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                {contact.unreadCount} não lidas
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCard;