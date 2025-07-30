import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const ChatModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  messages, 
  onSendMessage, 
  sendingMessage,
  webhookStatus 
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || sendingMessage) return;

    try {
      await onSendMessage(contact.id, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

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
      'Não realizado': 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colorMap[etiqueta] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1200] bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg h-[700px] flex flex-col max-h-[90vh]">
          {/* Header do Chat */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                {contact.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{contact.nome}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getEtiquetaColor(contact.etiqueta)}`}>
                    {contact.etiqueta}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(contact.status)}`}>
                    {getStatusText(contact.status)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Indicador de status do webhook */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  webhookStatus === 'connected' ? 'bg-success' : 
                  webhookStatus === 'error' ? 'bg-destructive' : 'bg-warning'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {webhookStatus === 'connected' ? 'Online' : 
                   webhookStatus === 'error' ? 'Erro' : 'Conectando...'}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
          
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                <p className="text-sm text-muted-foreground">Inicie uma conversa enviando uma mensagem</p>
              </div>
            ) : (
              messages.map((mensagem, index) => (
                <div
                  key={mensagem.id || index}
                  className={`flex ${mensagem.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                      mensagem.direction === 'outbound'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card text-foreground border border-border rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{mensagem.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${
                        mensagem.direction === 'outbound' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatMessageTime(mensagem.created_at)}
                      </p>
                      {mensagem.direction === 'outbound' && (
                        <div className="flex items-center space-x-1">
                          {mensagem.status === 'sent' && (
                            <Icon name="Check" size={12} className="text-primary-foreground/70" />
                          )}
                          {mensagem.status === 'delivered' && (
                            <div className="flex">
                              <Icon name="Check" size={12} className="text-primary-foreground/70" />
                              <Icon name="Check" size={12} className="text-primary-foreground/70 -ml-1" />
                            </div>
                          )}
                          {mensagem.status === 'read' && (
                            <div className="flex">
                              <Icon name="Check" size={12} className="text-success" />
                              <Icon name="Check" size={12} className="text-success -ml-1" />
                            </div>
                          )}
                          {mensagem.status === 'failed' && (
                            <Icon name="AlertCircle" size={12} className="text-destructive" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Footer do Chat */}
          <div className="p-4 border-t border-border bg-muted/30">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                    maxLength={4096}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {messageText.length}/4096 caracteres
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Enter para enviar, Shift+Enter para quebrar linha
                    </span>
                  </div>
                </div>
                <Button 
                  type="submit"
                  size="sm" 
                  disabled={!messageText.trim() || sendingMessage}
                  className="px-4 py-2"
                >
                  {sendingMessage ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={16} />
                  )}
                </Button>
              </div>
            </form>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>📱 {contact.telefone}</span>
                <span>🕒 {contact.ultimoContato}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Smartphone" size={12} />
                <span>{contact.origem}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatModal;