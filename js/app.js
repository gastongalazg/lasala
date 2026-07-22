// LA SALA — lógica del sitio
// No hace falta tocar este archivo para agregar contenido:
// el contenido vive en data/entries.js

(function () {
  "use strict";

  var listEl = document.getElementById("lista");
  var emptyEl = document.getElementById("estado-vacio");
  var filterButtons = document.querySelectorAll(".filtro");
  var currentFilter = "todo";

  var ENTRIES = (typeof ENTRADAS !== "undefined" ? ENTRADAS : []).slice();

  function parseFecha(fecha) {
    if (typeof fecha !== "string") return 0;
    var m = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      return d.getTime();
    }
    var t = Date.parse(fecha);
    return isNaN(t) ? 0 : t;
  }

  function getYouTubeEmbed(url) {
    try {
      var u = new URL(url);
      var host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") {
        var id = u.pathname.slice(1);
        return id ? "https://www.youtube-nocookie.com/embed/" + id : null;
      }
      if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
        if (u.pathname.indexOf("/embed/") === 0) {
          return "https://www.youtube-nocookie.com" + u.pathname + u.search;
        }
        var v = u.searchParams.get("v");
        var list = u.searchParams.get("list");
        if (v) {
          return (
            "https://www.youtube-nocookie.com/embed/" +
            v +
            (list ? "?list=" + list : "")
          );
        }
        if (list) {
          return "https://www.youtube-nocookie.com/embed/videoseries?list=" + list;
        }
      }
    } catch (e) {
      /* url inválida */
    }
    return null;
  }

  function getSpotifyEmbed(url) {
    try {
      var u = new URL(url);
      var host = u.hostname.replace(/^www\./, "");
      if (host === "open.spotify.com") {
        var path = u.pathname.indexOf("/embed/") === 0
          ? u.pathname.slice("/embed".length)
          : u.pathname;
        return {
          src: "https://open.spotify.com/embed" + path,
          tall: /\/(album|playlist)\//.test(path)
        };
      }
    } catch (e) {
      /* url inválida */
    }
    return null;
  }

  function getDriveEmbed(url) {
    var m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return m ? "https://drive.google.com/file/d/" + m[1] + "/preview" : null;
  }

  function crearReproductor(entrada) {
    var wrap = document.createElement("div");
    wrap.className = "player";

    if (entrada.tipo === "referencia") {
      var yt = getYouTubeEmbed(entrada.url || "");
      var sp = getSpotifyEmbed(entrada.url || "");

      if (yt) {
        wrap.classList.add("player--video");
        var iframeYt = document.createElement("iframe");
        iframeYt.src = yt;
        iframeYt.title = entrada.titulo || "Video de YouTube";
        iframeYt.loading = "lazy";
        iframeYt.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframeYt.allowFullscreen = true;
        wrap.appendChild(iframeYt);
        return wrap;
      }

      if (sp) {
        wrap.classList.add(sp.tall ? "player--spotify-tall" : "player--spotify");
        var iframeSp = document.createElement("iframe");
        iframeSp.src = sp.src;
        iframeSp.title = entrada.titulo || "Reproductor de Spotify";
        iframeSp.loading = "lazy";
        iframeSp.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        wrap.appendChild(iframeSp);
        return wrap;
      }

      var aviso = document.createElement("p");
      aviso.className = "player-error";
      aviso.textContent = "No se pudo reconocer este link como YouTube o Spotify.";
      wrap.appendChild(aviso);
      return wrap;
    }

    if (entrada.tipo === "riff") {
      var drive = getDriveEmbed(entrada.driveUrl || "");
      if (drive) {
        wrap.classList.add("player--drive");
        var iframeDr = document.createElement("iframe");
        iframeDr.src = drive;
        iframeDr.title = entrada.titulo || "Audio";
        iframeDr.loading = "lazy";
        iframeDr.allow = "autoplay";
        wrap.appendChild(iframeDr);
        return wrap;
      }
      var avisoDrive = document.createElement("p");
      avisoDrive.className = "player-error";
      avisoDrive.textContent = "No se pudo leer el link de Google Drive. Revisa que el archivo esté compartido como “Cualquier persona con el enlace”.";
      wrap.appendChild(avisoDrive);
      return wrap;
    }

    return wrap;
  }

  function crearTarjeta(entrada, rotacion) {
    var card = document.createElement("article");
    card.className = "card card--" + entrada.tipo;
    card.style.setProperty("--rot", rotacion + "deg");

    var tape = document.createElement("span");
    tape.className = "tape";
    tape.setAttribute("aria-hidden", "true");
    card.appendChild(tape);

    var head = document.createElement("div");
    head.className = "card-head";

    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = entrada.tipo === "riff" ? "Riff / idea" : "Referencia";
    head.appendChild(badge);

    if (entrada.fecha) {
      var fecha = document.createElement("time");
      fecha.className = "fecha";
      fecha.dateTime = entrada.fecha;
      fecha.textContent = formatearFecha(entrada.fecha);
      head.appendChild(fecha);
    }

    card.appendChild(head);

    var titulo = document.createElement("h2");
    titulo.className = "card-titulo";
    titulo.textContent = entrada.titulo || "(sin título)";
    card.appendChild(titulo);

    if (entrada.tema) {
      var tema = document.createElement("p");
      tema.className = "tema";
      tema.textContent = "Tema: " + entrada.tema;
      card.appendChild(tema);
    }

    card.appendChild(crearReproductor(entrada));

    if (entrada.nota) {
      var nota = document.createElement("p");
      nota.className = "nota";
      nota.textContent = entrada.nota;
      card.appendChild(nota);
    }

    return card;
  }

  function formatearFecha(fecha) {
    var t = parseFecha(fecha);
    if (!t) return fecha;
    var d = new Date(t);
    return d.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function render() {
    listEl.innerHTML = "";

    var filtradas = ENTRIES.filter(function (e) {
      if (currentFilter === "todo") return true;
      return e.tipo === currentFilter;
    });

    filtradas.sort(function (a, b) {
      return parseFecha(b.fecha) - parseFecha(a.fecha);
    });

    if (filtradas.length === 0) {
      emptyEl.hidden = false;
      emptyEl.textContent = ENTRIES.length === 0
        ? "Todavía no hay nada cargado. Cuando Gastón suba una referencia o un riff, va a aparecer acá."
        : "No hay entradas de este tipo todavía.";
      return;
    }

    emptyEl.hidden = true;

    var frag = document.createDocumentFragment();
    filtradas.forEach(function (entrada, i) {
      var rot = i % 2 === 0 ? -0.6 : 0.6;
      frag.appendChild(crearTarjeta(entrada, rot));
    });
    listEl.appendChild(frag);
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("filtro--activo"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("filtro--activo");
      btn.setAttribute("aria-pressed", "true");
      currentFilter = btn.dataset.filtro;
      render();
    });
  });

  render();
})();
