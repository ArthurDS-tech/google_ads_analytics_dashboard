# Umbler Frontend - Centro de Atendimento

Este é o código completo do frontend da página da Umbler, extraído do repositório original. Contém toda a interface visual para gerenciamento de atendimentos do WhatsApp.

## 🚀 Características

- **Interface Moderna**: Design limpo e responsivo usando Tailwind CSS
- **Componentes Reutilizáveis**: Sistema de componentes UI bem estruturado
- **Integração WhatsApp**: Interface para gerenciar atendimentos via webhook
- **Filtros Avançados**: Filtros por status e tags
- **Modal de Chat**: Interface de chat em tempo real
- **Estatísticas**: Dashboard com métricas de atendimento
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 📁 Estrutura do Projeto

```
umbler-frontend-complete/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx          # Componente de botão com variantes
│   │   │   └── Header.jsx          # Header principal com navegação
│   │   └── AppIcon.jsx             # Sistema de ícones
│   ├── pages/
│   │   └── Umbler.jsx              # Página principal da Umbler
│   ├── styles/
│   │   ├── tailwind.css            # Estilos CSS com variáveis
│   │   └── index.css               # Estilos base
│   ├── utils/
│   │   └── cn.js                   # Utilitário para classes CSS
│   ├── App.jsx                     # Componente principal
│   └── index.jsx                   # Ponto de entrada
├── package.json                    # Dependências do projeto
├── tailwind.config.js              # Configuração do Tailwind
├── vite.config.js                  # Configuração do Vite
├── postcss.config.js               # Configuração do PostCSS
└── index.html                      # HTML principal
```

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework principal
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework de estilos
- **Lucide React**: Ícones
- **Class Variance Authority**: Sistema de variantes
- **Tailwind Merge**: Utilitário para classes CSS

## 🚀 Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 🎨 Componentes Principais

### Header
- Navegação responsiva
- Menu mobile com drawer
- Dropdown de usuário
- Notificações

### Button
- Múltiplas variantes (default, outline, ghost, etc.)
- Diferentes tamanhos
- Suporte a ícones
- Estados de loading

### Umbler Page
- Dashboard com estatísticas
- Lista de clientes com filtros
- Modal de chat
- Gráficos de atendimento

## 🎯 Funcionalidades

### Dashboard de Atendimentos
- **Total de Atendimentos**: 247
- **Atendimentos Abertos**: 23
- **Atendimentos Encerrados**: 224
- **Tempo Médio de Resposta**: 12min

### Filtros
- **Status**: Todos, Online, Aguardando, Encerrado
- **Tags**: Sistema de etiquetas personalizadas
- **Busca**: Filtros dinâmicos

### Chat Modal
- Interface de chat em tempo real
- Histórico de mensagens
- Envio de mensagens
- Informações do cliente

## 🎨 Sistema de Cores

O projeto usa um sistema de cores consistente baseado em CSS variables:

- **Primary**: #2563EB (Azul)
- **Success**: #059669 (Verde)
- **Warning**: #D97706 (Amarelo)
- **Error**: #DC2626 (Vermelho)
- **Accent**: #10B981 (Verde claro)

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Menu hambúrguer e layout otimizado

## 🔧 Personalização

### Cores
Edite as variáveis CSS em `src/styles/tailwind.css`:

```css
:root {
  --color-primary: #2563EB;
  --color-success: #059669;
  /* ... outras cores */
}
```

### Componentes
Todos os componentes estão em `src/components/ui/` e podem ser facilmente modificados.

## 📄 Licença

Este código foi extraído do repositório original da Umbler e está disponível para uso em projetos pessoais e comerciais.

## 🤝 Contribuição

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**