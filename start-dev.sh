#!/bin/bash

# =============================================
# SCRIPT PARA INICIAR O SISTEMA COMPLETO
# =============================================

echo "🚀 Iniciando Google Ads Analytics Dashboard com Umbler Integration"
echo "================================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "📦 Instalando dependências do frontend..."
npm install

echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

echo "🔧 Configurando variáveis de ambiente..."

# Criar .env do backend se não existir
if [ ! -f backend/.env ]; then
    echo "📝 Criando backend/.env a partir do exemplo..."
    cp backend/.env.example backend/.env
    echo "⚠️  Por favor, configure as variáveis em backend/.env se necessário"
fi

# Criar .env do frontend se não existir
if [ ! -f .env ]; then
    echo "📝 Criando .env a partir do exemplo..."
    cp .env.example .env
    echo "⚠️  Por favor, configure as variáveis em .env se necessário"
fi

echo "🎯 Iniciando serviços..."

# Função para cleanup quando o script for interrompido
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar sinais de interrupção
trap cleanup SIGINT SIGTERM

# Iniciar backend em background
echo "🖥️  Iniciando backend na porta 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend inicializar
sleep 3

# Iniciar frontend em background
echo "🌐 Iniciando frontend na porta 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Sistema iniciado com sucesso!"
echo "================================================================="
echo "🌐 Frontend: http://localhost:5173"
echo "🖥️  Backend:  http://localhost:3001"
echo "📊 Google Ads Dashboard: http://localhost:5173"
echo "💬 Umbler Dashboard: http://localhost:5173/umbler"
echo "🔗 Webhook URL: http://localhost:3001/api/umbler/webhook"
echo "================================================================="
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Configure o webhook no Umbler para: http://localhost:3001/api/umbler/webhook"
echo "2. Configure as variáveis de ambiente em backend/.env (opcional)"
echo "3. Configure o banco Supabase em backend/.env (opcional)"
echo "4. Acesse http://localhost:5173/umbler para ver o dashboard"
echo ""
echo "📖 Para parar os serviços, pressione Ctrl+C"
echo ""

# Aguardar indefinidamente
wait