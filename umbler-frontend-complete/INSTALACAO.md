# 🚀 Instalação Rápida - Umbler Frontend

## Pré-requisitos
- Node.js 16+ 
- npm ou yarn

## Passos para Instalação

### 1. Clone ou baixe o projeto
```bash
# Se você baixou o ZIP, extraia e navegue para a pasta
cd umbler-frontend-complete
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm run dev
```

### 4. Acesse no navegador
```
http://localhost:3000
```

## ✅ Pronto!

O projeto está rodando e você pode ver toda a interface da Umbler funcionando.

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura dos Arquivos

```
umbler-frontend-complete/
├── src/
│   ├── components/ui/     # Componentes de interface
│   ├── pages/            # Páginas da aplicação
│   ├── styles/           # Arquivos CSS
│   └── utils/            # Utilitários
├── package.json          # Dependências
├── tailwind.config.js    # Configuração Tailwind
└── vite.config.js        # Configuração Vite
```

## 🎯 O que você verá

- **Header completo** com navegação
- **Dashboard de atendimentos** com estatísticas
- **Lista de clientes** com filtros
- **Modal de chat** funcional
- **Interface responsiva** para mobile e desktop

## 🛠️ Personalização

Para personalizar cores, edite `src/styles/tailwind.css`:
```css
:root {
  --color-primary: #2563EB;    /* Cor principal */
  --color-success: #059669;    /* Cor de sucesso */
  --color-warning: #D97706;    /* Cor de aviso */
  --color-error: #DC2626;      /* Cor de erro */
}
```

## 📞 Suporte

Se encontrar algum problema:
1. Verifique se o Node.js está atualizado
2. Delete a pasta `node_modules` e execute `npm install` novamente
3. Verifique se a porta 3000 está livre

---

**🎉 Parabéns! Você tem o frontend completo da Umbler rodando!**