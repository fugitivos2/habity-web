# 🚀 GUÍA RÁPIDA - @fugitivos2

## ✅ TIENES: tuhabity.com comprado en Namecheap

---

## 📋 INSTRUCCIONES PASO A PASO

### **PASO 1: Crear repositorio en GitHub** (2 min)

1. Ve a: https://github.com/new

2. Configurar:
   - **Repository name:** `habity-web`
   - **Description:** HABITY - Tu hogar en números
   - **Visibilidad:** ✅ Private
   - ❌ NO marques: "Add README", "Add .gitignore", "Choose license"

3. Click: **Create repository**

4. **COPIA la URL que aparece:**
   ```
   https://github.com/fugitivos2/habity-web.git
   ```

✅ **Repo creado!**

---

### **PASO 2: Descargar el proyecto** (ahora)

El proyecto está en: `/home/user/habity-web/`

**Descárgalo a tu ordenador.**

---

### **PASO 3: Subir código a GitHub**

**Abre terminal/cmd en la carpeta habity-web/ y ejecuta:**

```bash
# Ejecutar el script de setup
./setup-github.sh

# O si prefieres paso a paso:
git init
git add .
git commit -m "Initial commit - HABITY tuhabity.com"
git branch -M main
git remote add origin https://github.com/fugitivos2/habity-web.git
git push -u origin main
```

**Te pedirá credenciales:**
- **Username:** `fugitivos2`
- **Password:** ⚠️ NO uses tu contraseña normal

**Usa un Personal Access Token:**
1. Ve a: https://github.com/settings/tokens
2. Click: **Generate new token (classic)**
3. **Note:** HABITY Deploy
4. **Expiration:** 90 days (o lo que prefieras)
5. **Scopes:** ✅ Marcar **repo** (todos los sub-checkboxes)
6. Click: **Generate token**
7. **COPIA EL TOKEN** (ghp_xxxxxxxxxxxx)
8. Úsalo como "Password" en Git

✅ **Código en GitHub!**

---

### **PASO 4: Deploy en Vercel** (3 min)

1. Ve a: https://vercel.com/signup
2. Click: **Continue with GitHub**
3. Autorizar Vercel
4. Click: **Add New...** → **Project**
5. Buscar: `habity-web`
6. Click: **Import**
7. Configuración:
   - Framework Preset: **Next.js** (auto)
   - Root Directory: `./`
8. Click: **Deploy** 🚀

⏰ Esperar 1-2 minutos...

✅ **URL temporal:** `https://habity-web-xxx.vercel.app`

**ABRE LA URL** → Verás tu landing page funcionando! 🎉

---

### **PASO 5: Conectar tuhabity.com** (5 min)

**En Vercel Dashboard:**

1. Tu proyecto → **Settings** → **Domains**
2. Click: **Add Domain**
3. Escribir: `tuhabity.com`
4. Click: **Add**

Vercel te mostrará:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**En Namecheap:**

1. Login: https://namecheap.com
2. **Domain List** → Click `tuhabity.com` → **Manage**
3. Sección **NAMESERVERS**
4. Seleccionar: **Custom DNS**
5. Añadir:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
6. Click: ✅ **Checkmark verde** (guardar)

⏰ **Esperar propagación DNS:** 30 min - 2 horas

---

### **PASO 6: Añadir www**

En Vercel:
1. **Domains** → **Add Domain**
2. Escribir: `www.tuhabity.com`
3. Click: **Add**

Vercel lo redirige automáticamente a `tuhabity.com`

---

### **PASO 7: Verificar** ⏰ (después de propagación)

**Comprobar DNS:**
- https://dnschecker.org
- Buscar: `tuhabity.com`
- Esperar a que aparezca verde

**Abrir tu web:**
- https://tuhabity.com
- Ver candado 🔒 → SSL activo
- Ver landing page → ¡Funciona!

✅ **¡ONLINE!** 🎉

---

## 📊 RESUMEN VISUAL

```
1. Crear repo en GitHub        → 2 min
   ↓
2. Descargar proyecto          → 1 min
   ↓
3. Subir código a GitHub       → 5 min
   ↓
4. Deploy en Vercel            → 3 min
   ↓
5. Conectar tuhabity.com       → 2 min
   ↓
6. Configurar DNS Namecheap    → 3 min
   ↓
7. Esperar propagación         → 30 min - 2h
   ↓
8. ✅ https://tuhabity.com
```

**Tiempo activo:** ~15 minutos  
**Tiempo de espera:** 30 min - 2 horas

---

## 🆘 PROBLEMAS COMUNES

### ❌ "Git pide password y no funciona"
**Solución:** No uses tu contraseña de GitHub, usa Personal Access Token:
- https://github.com/settings/tokens
- Generate new token (classic)
- Marcar scope: **repo**
- Copiar token y usar como password

### ❌ "Permission denied (publickey)"
**Solución:** Usa HTTPS en lugar de SSH:
```bash
git remote set-url origin https://github.com/fugitivos2/habity-web.git
```

### ❌ "DNS no propaga después de 2 horas"
**Solución:**
- Verificar que nameservers están guardados en Namecheap
- Esperar hasta 48h (máximo)
- Limpiar caché DNS de tu ordenador

---

## 📱 SIGUIENTE PASO DESPUÉS

Una vez online, puedes:
- [ ] Configurar email: hola@tuhabity.com
- [ ] Añadir Google Analytics
- [ ] Integrar Mailchimp (captura emails)
- [ ] Anunciar en redes sociales

---

## 📞 SOPORTE

**Vercel:** https://vercel.com/help  
**Namecheap:** Chat 24/7 en web  
**GitHub:** https://docs.github.com

---

## ✅ CHECKLIST

- [x] Dominio tuhabity.com comprado
- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Deploy en Vercel
- [ ] Dominio conectado en Vercel
- [ ] DNS configurado en Namecheap
- [ ] Propagación DNS completada
- [ ] https://tuhabity.com funciona
- [ ] SSL activo 🔒

---

## 🎉 ¡ÉXITO!

**Estás a 15 minutos + espera de tener tuhabity.com online.**

**Empieza por el PASO 1** ☝️

¡Mucha suerte @fugitivos2! 🚀🏠
