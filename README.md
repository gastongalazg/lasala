# La Sala — LOEN

Sitio interno de la banda para centralizar referencias musicales (YouTube / Spotify) y riffs o ideas propias (audio en Google Drive). Sin login, sin app, un clic y suena.

Sitio en vivo: **https://gastongalazg.github.io/lasala/**

---

## Cómo agregar una entrada nueva (para Gastón)

Todo el contenido del sitio vive en un solo archivo: [`data/entries.js`](data/entries.js). No hace falta saber programar, solo copiar, pegar y completar texto.

### 1. Para subir una referencia (YouTube o Spotify)

1. Copia el link de la canción/álbum/playlist de YouTube o Spotify (el link normal, tal cual lo copias del navegador o de la app — no hay que editarlo ni sacar ningún ID a mano).
2. Abre `data/entries.js` (directo en github.com, tocando el ícono del lápiz ✏️, o con tu editor si trabajas local).
3. Pega este bloque dentro del arreglo `ENTRADAS`, justo después de `const ENTRADAS = [`:

   ```js
   {
     tipo: "referencia",
     titulo: "Nombre de la canción o banda",
     fecha: "2026-07-20",
     url: "PEGA_AQUI_EL_LINK_DE_YOUTUBE_O_SPOTIFY",
     tema: "",
     nota: "por qué la subiste / qué onda tiene"
   },
   ```

4. Completa `titulo`, `fecha` (formato AAAA-MM-DD, es solo para ordenar, no se muestra tal cual), `url` y `nota`. `tema` es opcional — cuando la asocias a una canción propia de la banda, escribe su nombre ahí; si no, déjalo como `""`.
5. Guarda / haz commit y push (o si editas en github.com, el botón verde "Commit changes" al final de la página).

### 2. Para subir un riff o idea propia (audio)

1. Sube el mp3 o el archivo de audio (el que descargas de WhatsApp, sea mp3 u opus) a una carpeta de Google Drive.
2. Click derecho sobre el archivo → **Compartir** → cambia el acceso a **"Cualquier persona con el enlace"** (esto es obligatorio, si no la banda no va a poder escucharlo). Copia el link que te da Drive.
3. Abre `data/entries.js` y pega este bloque dentro del arreglo `ENTRADAS`:

   ```js
   {
     tipo: "riff",
     titulo: "Riff nuevo para el intro",
     fecha: "2026-07-20",
     driveUrl: "PEGA_AQUI_EL_LINK_DE_GOOGLE_DRIVE",
     tema: "",
     nota: "grabado en el ensayo del jueves"
   },
   ```

4. Completa los datos igual que en el paso anterior y sube el cambio.

**Nota sobre formato de audio:** el reproductor de Google Drive reproduce mp3 sin problema. Con archivos `.opus` (los de nota de voz de WhatsApp) puede que a veces no los reconozca bien — si al probar el link no suena, la solución más simple es convertir ese archivo a mp3 antes de subirlo a Drive (hay conversores online gratuitos) y volver a compartir el link.

### 3. Cuánto tarda en aparecer

Después de subir el cambio a GitHub, el sitio se actualiza solo en **1 a 2 minutos**. No hay que avisarle a nadie ni tocar nada más.

### Cosas para no romper

- No borres las comas `,` entre entradas ni las llaves `{ }` / corchetes `[ ]`.
- El campo `tipo` tiene que ser exactamente `"referencia"` o `"riff"` (con las comillas), si no la entrada no se va a mostrar.
- Si algo queda mal escrito, en el peor de los casos el sitio se queda en blanco — no se rompe nada permanente. Puedes deshacer el último cambio en GitHub (pestaña "commits" → "Revert") o pedir ayuda para revisar el archivo.

---

## Configuración técnica (una sola vez)

Esto ya debería estar hecho, pero por si el sitio no carga en la URL de arriba:

1. En GitHub, entra al repositorio → **Settings** → **Pages**.
2. En "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: **main**, carpeta **/ (root)**. Guardar.
4. GitHub muestra la URL pública (usuario.github.io/repo) arriba de esa misma sección — puede tardar uno o dos minutos en activarse la primera vez.

## Estructura del proyecto

```
index.html         → estructura de la página
css/style.css       → estilos (línea DIY / flyer de recital)
js/app.js           → lógica: lee data/entries.js, arma las tarjetas y los reproductores
data/entries.js     → CONTENIDO — el único archivo que se edita para agregar cosas
```

No hay build, no hay `npm install`, no hay backend. Es HTML/CSS/JS plano — se puede abrir `index.html` directo en el navegador para probar localmente antes de subirlo.

## Qué queda fuera de esta primera versión

Dominio propio, login, panel de administración, comentarios/reacciones, buscador. Estas quedaron explícitamente descartadas para esta iteración (ver documento de requerimiento).
