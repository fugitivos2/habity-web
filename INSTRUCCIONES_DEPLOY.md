# 🚀 INSTRUCCIONES RÁPIDAS DE DEPLOY

## ✅ YA TIENES: tuhabity.com comprado en Namecheap

---

## 📦 PASO 1: DESCARGAR Y DESCOMPRIMIR

```bash
# Descomprimir el proyecto
tar -xzf habity-web-tuhabity-final.tar.gz
cd habity-web/

# Verificar que todo está
ls -la
```

---

## 🐙 PASO 2: SUBIR A GITHUB (5 minutos)

### 2.1 Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. **Repository name:** `habity-web` (o el nombre que prefieras)
3. **Description:** "HABITY - Tu hogar en números | Landing page oficial"
4. **Visibilidad:** Private (recomendado) o Public
5. ❌ **NO marques:** "Add README", "Add .gitignore", "Choose license"
6. Click: **Create repository**
7. **Copia la URL** que aparece (ejemplo: `https://github.com/TU_USUARIO/habity-web.git`)

### 2.2 Subir el código

```bash
# Dentro de la carpeta habity-web/

# Inicializar Git
git init
git add .
git commit -m "Initial commit - HABITY tuhabity.com"
git branch -M main

# Conectar con tu repositorio (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/habity-web.git

# Subir
git push -u origin main
```

**Si te pide credenciales:**
- Username: Tu usuario de GitHub
- Password: Usa un **Personal Access Token** (no tu contraseña)
  - Crear token: https://github.com/settings/tokens
  - Scopes: Marcar "repo"

✅ **Código en GitHub!**

---

## ☁️ PASO 3: DEPLOY EN VERCEL (3 minutos)

### 3.1 Crear cuenta Vercel

1. Ve a: https://vercel.com/signup
2. Click: **Continue with GitHub**
3. Autorizar Vercel
4. ✅ Cuenta creada

### 3.2 Importar proyecto

1. Click: **Add New...** → **Project**
2. Buscar tu repo: `habity-web`
3. Click: **Import**
4. **Framework Preset:** Next.js (auto-detectado)
5. **Root Directory:** `./` (por defecto)
6. Click: **Deploy** 🚀

⏰ **Espera 1-2 minutos...**

✅ **¡Deploy completado!**

**URL temporal:** `https://habity-web-xxx.vercel.app`

**Pruébala:** Abre la URL y verás tu landing page funcionando! 🎉

---

## 🌐 PASO 4: CONECTAR tuhabity.com (5 minutos)

### 4.1 En Vercel Dashboard

1. Ve a tu proyecto → **Settings** → **Domains**
2. Click: **Add Domain**
3. Escribe: `tuhabity.com`
4. Click: **Add**

Vercel te mostrará 2 opciones:

**OPCIÓN A: Nameservers (RECOMENDADO - MÁS FÁCIL)**
- Vercel te da:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```

**OPCIÓN B: DNS Records**
- Vercel te muestra qué records configurar

### 4.2 En Namecheap (elige Opción A o B)

#### OPCIÓN A: Cambiar Nameservers (MÁS FÁCIL) ⭐

1. Login en Namecheap: https://namecheap.com
2. **Domain List** → Click en `tuhabity.com` → **Manage**
3. Sección **NAMESERVERS**
4. Seleccionar: **Custom DNS**
5. Añadir:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
6. Click: ✅ **Checkmark verde** (Save)

⏰ **Propagación:** 5 minutos - 2 horas (normalmente 30 min)

#### OPCIÓN B: Añadir DNS Records (ALTERNATIVA)

1. Login en Namecheap
2. **Domain List** → `tuhabity.com` → **Manage**
3. Tab: **Advanced DNS**
4. **Host Records** → **Add New Record**

**Record 1:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**Record 2:**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

5. Click: **Save All Changes**

⏰ **Propagación:** 30 min - 2 horas

---

### 4.3 Añadir www.tuhabity.com también

En Vercel:
1. **Domains** → **Add Domain**
2. Escribe: `www.tuhabity.com`
3. **Add**

Vercel lo redirige automáticamente a `tuhabity.com` ✅

---

## ⏰ ESPERAR PROPAGACIÓN DNS

**Comprobar estado:**
- https://dnschecker.org
- Buscar: `tuhabity.com`
- Esperar a que esté verde en varios países

**Normalmente tarda:** 30 minutos - 2 horas

---

## 🔒 PASO 5: VERIFICAR SSL (AUTOMÁTICO)

Una vez DNS propagado:

1. Abrir: https://tuhabity.com
2. Ver **candado 🔒** en navegador
3. ✅ **¡Funciona!**

Vercel activa SSL automáticamente (Let's Encrypt).

---

## ✅ CHECKLIST FINAL

- [x] Dominio tuhabity.com comprado (Namecheap)
- [ ] Proyecto descargado y descomprimido
- [ ] Subido a GitHub
- [ ] Deploy en Vercel completado
- [ ] DNS configurado en Namecheap
- [ ] Esperado propagación DNS
- [ ] https://tuhabity.com funciona
- [ ] SSL activo (candado 🔒)
- [ ] https://www.tuhabity.com redirige

---

## 🎉 ¡LISTO!

**Tu landing page estará en:**
- ✅ https://tuhabity.com
- ✅ https://www.tuhabity.com

**Con:**
- ✅ HTTPS seguro
- ✅ CDN global rápido
- ✅ Deploy automático en cada push

---

## 📧 PRÓXIMOS PASOS OPCIONALES

1. **Email profesional:** hola@tuhabity.com
2. **Google Analytics:** Medir tráfico
3. **Mailchimp:** Captura de emails
4. **Redes sociales:** Anunciar lanzamiento

---

## 🆘 SI ALGO NO FUNCIONA

### "GitHub me pide password"
- No uses tu contraseña normal
- Crea Personal Access Token: https://github.com/settings/tokens
- Scopes: Marcar "repo"

### "DNS no propaga después de 2 horas"
- Verificar en Namecheap que los nameservers están guardados
- Limpiar caché DNS: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)

### "Vercel no reconoce Next.js"
- Verificar que `package.json` existe
- Framework Preset: Seleccionar manualmente "Next.js"

---

## 📞 SOPORTE

**Vercel:**
- Chat: https://vercel.com/help
- Docs: https://vercel.com/docs

**Namecheap:**
- Chat 24/7: https://namecheap.com
- Support: https://support.namecheap.com

---

## 🚀 ¡ÉXITO CON EL LANZAMIENTO!

**¡tuhabity.com está listo para cambiar el sector inmobiliario!** 🏠💙
