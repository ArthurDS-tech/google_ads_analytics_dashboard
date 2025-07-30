#!/bin/bash

# 🚀 Script de Inicialização Umbler
# Este script configura e inicia o ambiente de desenvolvimento

echo "🚀 Iniciando ambiente Umbler..."

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado! Configure as variáveis antes de continuar."
    echo ""
    echo "📋 Principais configurações:"
    echo "   REACT_APP_BACKEND_URL=http://localhost:3000/api"
    echo ""
    echo "⚠️  Configure o .env e execute novamente este script."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se o backend está rodando
echo "🔍 Verificando backend..."
BACKEND_URL=$(grep REACT_APP_BACKEND_URL .env | cut -d '=' -f2)
if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="http://localhost:3000/api"
fi

# Extrair apenas o host e porta do backend para health check
BACKEND_BASE=$(echo $BACKEND_URL | sed 's|/api||')
HEALTH_URL="$BACKEND_BASE/health"

echo "   Testando: $HEALTH_URL"

if curl -s -f "$HEALTH_URL" > /dev/null 2>&1; then
    echo "✅ Backend está rodando!"
else
    echo "⚠️  Backend não está acessível em $HEALTH_URL"
    echo ""
    echo "📋 Para iniciar o backend:"
    echo "   1. Navegue até a pasta do backend"
    echo "   2. Execute: npm run dev"
    echo ""
    echo "🔄 Continuando mesmo assim..."
fi

echo ""
echo "🌟 Iniciando frontend..."
echo "📱 Acesse: http://localhost:5173/umbler"
echo ""
echo "💡 Funcionalidades disponíveis:"
echo "   • Dashboard de contatos em tempo real"
echo "   • Chat integrado com WhatsApp"
echo "   • Filtros e busca avançada"
echo "   • Monitoramento de webhook"
echo ""

# Iniciar o servidor de desenvolvimento
npm run dev