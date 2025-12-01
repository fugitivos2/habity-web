#!/bin/bash

# Script de ayuda para deploy de HABITY
# tuhabity.com

echo "🚀 HABITY Deploy Helper"
echo "======================="
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Asegúrate de estar en la carpeta habity-web/"
    exit 1
fi

echo "✅ Directorio correcto"
echo ""

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado"
    echo "   Instala Git: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git instalado"
echo ""

# Inicializar Git si no existe
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - HABITY tuhabity.com"
    git branch -M main
    echo "✅ Repositorio inicializado"
else
    echo "✅ Repositorio Git ya existe"
fi

echo ""
echo "───────────────────────────────────"
echo ""
echo "📝 SIGUIENTE PASO:"
echo ""
echo "1. Crea un repositorio en GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Copia la URL del repositorio"
echo "   Ejemplo: https://github.com/TU_USUARIO/habity-web.git"
echo ""
echo "3. Ejecuta estos comandos:"
echo ""
echo "   git remote add origin https://github.com/TU_USUARIO/habity-web.git"
echo "   git push -u origin main"
echo ""
echo "4. Ve a Vercel y conecta tu repositorio:"
echo "   https://vercel.com/new"
echo ""
echo "5. Después del deploy, configura el dominio:"
echo "   Vercel Dashboard → Settings → Domains → Add tuhabity.com"
echo ""
echo "6. En Namecheap, configura los nameservers:"
echo "   ns1.vercel-dns.com"
echo "   ns2.vercel-dns.com"
echo ""
echo "───────────────────────────────────"
echo ""
echo "📖 Guía completa en: INSTRUCCIONES_DEPLOY.md"
echo ""
echo "✅ ¡Buena suerte con el deploy! 🚀"
