# betrusty-web-scraping-demo

## 📌 ¿Por qué este scraping solo funciona en local?

Este proyecto realiza **web scraping** sobre páginas **dinámicas** (por ejemplo, Airbnb).  
Estas páginas generan gran parte de su contenido usando **JavaScript** en el navegador, por lo que no basta con hacer una simple petición HTTP:  
es necesario **abrir un navegador real o headless** (como Chromium) que ejecute el JavaScript y luego extraiga los datos.

---

## 🚫 Limitaciones en entornos *serverless*

Plataformas de hosting *serverless* (como **Vercel**, **Netlify**, AWS Lambda, etc.) tienen restricciones que impiden que este tipo de scraping funcione allí:

1. **No permiten procesos largos o persistentes**  
   - Los navegadores (aunque sean *headless*) necesitan mantenerse abiertos mientras cargan y procesan la página.  
   - En *serverless*, el tiempo máximo de ejecución suele ser de **10–15 minutos** (en muchos casos incluso menos).

2. **Límite de tamaño de función**  
   - Navegadores como Chromium pesan **decenas o cientos de MB**.  
   - Vercel, por ejemplo, impone un máximo de **50 MB comprimido** y **250 MB descomprimido** para cada función serverless.  
   - Esto hace imposible empaquetar un navegador completo dentro de la función.

3. **Entorno restringido**  
   - En *serverless* no existe un entorno gráfico donde correr el navegador.  
   - Aunque uses *headless*, muchas librerías requieren dependencias del sistema que no están instaladas.

---

## 💻 ¿Por qué sí funciona en local?

En tu máquina local:
- Sí puedes instalar y ejecutar **Chromium/Chrome** o **Firefox** sin limitaciones.
- El navegador puede permanecer abierto todo el tiempo que necesite el script.
- No existe límite de tamaño ni de dependencias del sistema.

---

## 🛠 Posibles soluciones para producción

Si necesitas que este scraping corra en un servidor remoto, considera:

1. **Usar un servidor dedicado o VPS**  
   - Ejemplo: DigitalOcean, AWS EC2, Hetzner…  
   - Allí puedes instalar el navegador y mantenerlo abierto sin restricciones.

2. **Usar un servicio de scraping con navegador incluido**  
   - Ejemplo: **ScrapFly**, **Bright Data**, **Apify**.  
   - Estos ya tienen infraestructura optimizada para páginas dinámicas.

3. **Separar scraping y API pública**  
   - Ejecutar el scraping en un servidor con navegador.  
   - Guardar los datos en una base de datos y exponerlos vía API desde tu app *serverless*.

---

## 🚀 Cómo usarlo (Modo Local)

Sigue estos pasos para probar el scraping en tu máquina:

1. **Abrir Airbnb** y buscar la página que quieres scrapear.  
2. **Copiar el enlace** desde la barra de direcciones del navegador.  
3. Abrir tu aplicación local en **`http://localhost:3000`**.  
4. En el buscador de la aplicación, **pegar el enlace** copiado de Airbnb.  
5. Hacer clic en **`Fetch Info`**.  
6. ¡Listo! La información de la página se mostrará en pantalla.

---

## 🎥 Ejemplo en video

https://github.com/user-attachments/assets/cd1587a4-f967-40a7-b7fd-94d37e20eb23

---

## 📚 Referencias

- [Vercel — Límite de tamaño en funciones](https://vercel.com/guides/troubleshooting-function-250mb-limit)  
- [Scrapfly — Scraping con navegadores](https://scrapfly.io/blog/posts/scraping-using-browsers)  
- [AWS Lambda — Timeout máximo](https://lumigo.io/aws-lambda-performance-optimization/aws-lambda-timeout-best-practices/)  
