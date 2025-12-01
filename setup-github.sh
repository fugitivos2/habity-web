#!/bin/bash

# Script para subir HABITY a GitHub
# Usuario: @fugitivos2

echo "🚀 HABITY - Setup GitHub"
echo "========================"
echo ""
echo "Usuario: @fugitivos2"
echo "Repositorio: habity-web"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta habity-web/"
    exit 1
fi

echo "✅ Directorio correcto"
echo ""

# Limpiar git anterior si existe
if [ -d ".git" ]; then
    echo "🧹 Limpiando repositorio Git anterior..."
    rm -rf .git
fi

# Inicializar Git
echo "📦 Inicializando Git..."
git init
echo "✅ Git inicializado"
echo ""

# Configurar usuario Git (si no está configurado)
if [ -z "$(git config user.name)" ]; then
    echo "👤 Configurando usuario Git..."
    read -p "Tu nombre completo: " nombre
    read -p "Tu email de GitHub: " email
    git config user.name "$nombre"
    git config user.email "$email"
    echo "✅ Usuario configurado"
    echo ""
fi

# Añadir archivos
echo "📝 Añadiendo archivos..."
git add .
echo "✅ Archivos añadidos"
echo ""

# Commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit - HABITY tuhabity.com"
echo "✅ Commit creado"
echo ""

# Configurar rama main
git branch -M main
echo "✅ Rama main configurada"
echo ""

echo "───────────────────────────────────────"
echo ""
echo "📋 SIGUIENTE PASO:"
echo ""
echo "1. Ve a GitHub y crea el repositorio:"
echo "   https://github.com/new"
echo ""
echo "   Nombre: habity-web"
echo "   Visibilidad: Private"
echo "   NO marques ningún checkbox"
echo ""
echo "2. Después de crear el repo, ejecuta:"
echo ""
echo "   git remote add origin https://github.com/fugitivos2/habity-web.git"
echo "   git push -u origin main"
echo ""
echo "3. Te pedirá credenciales:"
echo "   Username: fugitivos2"
echo "   Password: [Personal Access Token - NO tu contraseña]"
echo ""
echo "   Crear token en: https://github.com/settings/tokens"
echo "   Scopes: Marcar 'repo'"
echo ""
echo "───────────────────────────────────────"
echo ""
echo "✅ Git está listo. Sigue las instrucciones de arriba."
