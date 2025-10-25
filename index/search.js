let juegos = [];
let fuse;

async function cargarJuegos() {
  const res = await fetch('games.json');
  juegos = await res.json();
  fuse = new Fuse(juegos, {
    keys: ['name', 'alias', 'core', 'genre'],
    threshold: 0.3,
    includeScore: true
  });

  // Crear catálogos después de cargar juegos
  crearCatalogo('Plataformeros', 'genre', 'platformer');
  crearCatalogo('RPGs', 'genre', 'rpg');
  crearCatalogo('NES', 'core', 'nes');
  crearCatalogo('SNES', 'core', 'snes');
  crearCatalogo('NINTENDO DS', 'core', 'nds');
  crearCatalogo('NINTENDO 64', 'core', 'n64');
  crearCatalogo('PS1', 'core', 'psx');
  crearCatalogo('GAMEBOY', 'core', 'gb');
  crearCatalogo('GENESIS', 'core', 'genesis');
}

function crearCatalogo(titulo, filtroKey, filtroValor) {
  // Crear contenedor general para este catálogo
  const content = document.querySelector('.content');

  // Crear un contenedor para este catálogo
  const catalogContainer = document.createElement('section');
  catalogContainer.classList.add('catalog-container');

  // Título
  const h2 = document.createElement('h2');
  h2.textContent = titulo;
  h2.classList.add('catalog-title');
  catalogContainer.appendChild(h2);

  // Div con clase catalog para los items
  const catalog = document.createElement('div');
  catalog.classList.add('catalog');
  catalogContainer.appendChild(catalog);

  // Filtrar juegos según filtroKey y filtroValor
  let juegosFiltrados = juegos.filter(juego => {
    if (Array.isArray(filtroValor)) {
      return filtroValor.includes(juego[filtroKey]);
    } else {
      return juego[filtroKey] === filtroValor;
    }
  });

  // Crear cada item
  juegosFiltrados.forEach(juego => {
    const imgJuego = `images/games/i${juego.id}.png`;  // i + id + .png
    const iconConsola = `images/icons/${juego.core}.png`;

    const item = document.createElement('div');
    item.classList.add('item');

    item.innerHTML = `
      <a href="../emulator/emulator.html?core=${encodeURIComponent(juego.core)}&id=${encodeURIComponent(juego.id)}">
        <img src="${imgJuego}" alt="${juego.name}" class="item-img" />
        <div class="item-caption">
          <h3>${juego.name}</h3>
          <img src="${iconConsola}" alt="${juego.core}" class="item-icon" />
        </div>
        <p class="item-desc">${juego.description || ''}</p>
      </a>
    `;

    catalog.appendChild(item);
  });

  content.appendChild(catalogContainer);
}

window.onload = () => {
  cargarJuegos();

  // Añadí también el buscador como antes
  document.getElementById('busqueda').addEventListener('input', () => {
    const query = document.getElementById('busqueda').value.trim();
    if (!query) {
      // Limpiar resultados si buscador vacío
      document.getElementById('resultados').innerHTML = '';
      return;
    }
    const resultados = fuse.search(query)
      .filter(result => result.score <= 0.2)
      .slice(0, 5)
      .map(result => result.item);

    mostrarResultados(resultados);
  });
};

function mostrarResultados(lista) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<li>No se encontraron resultados.</li>';
    return;
  }

  lista.forEach(juego => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="../emulator/emulator.html?core=${encodeURIComponent(juego.core)}&id=${encodeURIComponent(juego.id)}">
        <div class="nombre">${juego.name}</div>
      </a>
    `;

    contenedor.appendChild(li);
  });
}
