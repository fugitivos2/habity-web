# HABITY - Tu hogar en números 🏠

Landing page oficial de HABITY, la plataforma integral inmobiliaria y financiera.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 + React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Hosting**: Vercel (recomendado)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start
```

## 🌐 Configuración de Dominio

### tuhabity.com (TU DOMINIO)
```bash
# En Vercel Dashboard
1. Añadir dominio: tuhabity.com
2. Configurar DNS en proveedor:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
```

### Opción 2: gethabity.com
```bash
# Mismo proceso con gethabity.com
```

## 🎨 Personalización

### Colores (tailwind.config.ts)
- **Primary**: #0066FF (Azul confianza)
- **Secondary**: #10B981 (Verde crecimiento)
- **Accent**: #F97316 (Naranja energía)

### Logo
Reemplazar en `components/Hero.tsx` y `components/Footer.tsx`

## 📧 Integración Email (Pendiente)

Reemplazar en `components/CTA.tsx`:
```typescript
// TODO: Mailchimp/Brevo integration
const handleSubmit = async (e) => {
  // API call here
}
```

## 🚢 Deploy en Vercel

```bash
# Opción 1: Automático (Git)
1. Push a GitHub
2. Conectar repo en Vercel
3. Deploy automático

# Opción 2: CLI
npm install -g vercel
vercel
```

## 📊 Analytics (Opcional)

1. Google Analytics
2. Hotjar
3. Vercel Analytics (gratis)

## 📝 Estructura del Proyecto

```
habity-web/
├── app/
│   ├── layout.tsx      # Layout principal + SEO
│   ├── page.tsx        # Home page
│   └── globals.css     # Estilos globales
├── components/
│   ├── Hero.tsx        # Hero section + CTA
│   ├── Features.tsx    # Características
│   ├── HowItWorks.tsx  # Cómo funciona (4 pasos)
│   ├── Simulators.tsx  # Simuladores interactivos
│   ├── Pricing.tsx     # 3 planes de precios
│   ├── CTA.tsx         # Formulario beta
│   ├── FAQ.tsx         # Preguntas frecuentes
│   └── Footer.tsx      # Footer + links
├── public/             # Assets estáticos
└── lib/                # Utilidades (futuro)
```

## ✅ Checklist Pre-lanzamiento

- [ ] Dominio comprado y configurado
- [ ] SSL certificado activo (automático en Vercel)
- [ ] Google Analytics configurado
- [ ] Meta tags y Open Graph completos
- [ ] Favicon agregado
- [ ] Formulario de email integrado
- [ ] Responsive probado (móvil/tablet/desktop)
- [ ] Velocidad optimizada (Lighthouse 90+)
- [ ] Links de redes sociales actualizados
- [ ] Email de contacto configurado

## 🔗 Links Importantes

- **Vercel**: https://vercel.com
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google.com
- **Mailchimp**: https://mailchimp.com

## 📞 Soporte

- Email: hola@tuhabity.com
- Web: https://tuhabity.com

---

**Desarrollado con ❤️ para HABITY**
