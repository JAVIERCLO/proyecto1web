// Estructura base
export const createLayout = () => {
    const titulo = document.createElement('h1');
    titulo.textContent = 'Posts';
    titulo.id = 'main-title'

    const container = document.createElement('div');
    container.id = 'posts-container';
    container.classList.add('card-grid');

    document.body.appendChild(titulo);
    document.body.appendChild(container); 
};

// Crear un post
export const createPost = (post) => {
    const article = document.createElement("article");
    article.classList.add('post-card');

    const h2 = document.createElement("h2");
    h2.classList.add('post-card__title');
    h2.textContent = post.title;

    const resumen = document.createElement('p');
    resumen.classList.add('post-card__body');
    resumen.textContent = post.body.length > 250
        ? post.body.substring(0, 250) + '...'
        : post.body;
    const tags = document.createElement('div');
    tags.classList.add('post-card__tags');
    (post.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = tag;
        tags.appendChild(span);
    });

    const acciones = document.createElement('div');
    acciones.classList.add('post-card__acciones');

    const btnDetalle = document.createElement('button');
    btnDetalle.textContent = 'Ver detalle';
    btnDetalle.classList.add('btn', 'btn--primary');
    btnDetalle.dataset.id = post.id;
    btnDetalle.dataset.action = 'ver-detalle';

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add('btn', 'btn--danger');
    btnEliminar.dataset.id = post.id;
    btnEliminar.dataset.action = 'eliminar';

    article.appendChild(h2);
    article.appendChild(btnEliminar);
    article.appendChild(btnDetalle);
    article.appendChild(resumen);
    article.appendChild(tags);
    article.appendChild(acciones);

    return article;
};

// Renderizar posts
export const renderPosts = (posts) => {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    if (posts.length === 0) {
        const empty = document.createElement('p');
        empty.classList.add('estado-vacio');
        empty.textContent = 'No se encontraron publicaciones con esos filtros.';
        container.appendChild(empty);
        return;
    }

    posts.forEach(post => {
        const elemento = createPost(post);
        container.appendChild(elemento);
    });
};

// Eliminar del DOM
export const removePostFromDOM = (elemento) => {
    elemento.remove();
};

// Crear filtros
export const createFilters = () => {
    const container = document.createElement('div');
    container.id = 'filters-container';

// texto
    const inputFiltroTexto = document.createElement('input');
    inputFiltroTexto.type = 'text';
    inputFiltroTexto.placeholder = 'Filtrar por texto...';
    inputFiltroTexto.id = 'filter-text';

// autor
    const inputFiltroAutor = document.createElement('input');
    inputFiltroAutor.type = 'number';
    inputFiltroAutor.placeholder = 'Filtrar por autor';
    inputFiltroAutor.id = 'filter-author';

// tags
    const inputFiltroTags = document.createElement('input');
    inputFiltroTags.type = 'text';
    inputFiltroTags.placeholder = 'Filtrar por tags';
    inputFiltroTags.id = 'filter-tags';

    container.appendChild(inputFiltroTexto);
    container.appendChild(inputFiltroAutor);
    container.appendChild(inputFiltroTags);

    document.body.appendChild(container);
};
export const showDetailView = (post, user) => {
    // Ocultar listado y filtros
    document.getElementById('posts-container').style.display = 'none';
    document.getElementById('main-title').style.display = 'none';
    const filtersEl = document.getElementById('filters-container');
    if (filtersEl) filtersEl.style.display = 'none';

    // Limpiar detalle anterior si existe
    const anterior = document.getElementById('detail-section');
    if (anterior) anterior.remove();

    const section = document.createElement('section');
    section.id = 'detail-section';

    // Cabecera con botón volver
    const cabecera = document.createElement('div');
    cabecera.classList.add('detail-cabecera');

    const btnBack = document.createElement('button');
    btnBack.textContent = 'Volver al listado';
    btnBack.classList.add('btn', 'btn--back');
    btnBack.dataset.action = 'volver';

    cabecera.appendChild(btnBack);

    // Titulo
    const titulo = document.createElement('h2');
    titulo.classList.add('detail-titulo');
    titulo.textContent = post.title;

    // Tags
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('detail-tags');
    (post.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = tag;
        tagsDiv.appendChild(span);
    });

    // Cuerpo
    const cuerpo = document.createElement('p');
    cuerpo.classList.add('detail-cuerpo');
    cuerpo.textContent = post.body;

    // Grid de campos (minimo 6 segun RF-02)
    const metaGrid = document.createElement('div');
    metaGrid.classList.add('detail-meta');

    const campos = [
        { label: 'ID del post: ',  value: post.id },
        { label: 'Autor: ',        value: user ? `${user.firstName} ${user.lastName}` : `Usuario #${post.userId}` },
        { label: 'Usuario: ',      value: user ? `@${user.username}` : `ID: ${post.userId}` },
        { label: 'Me gusta: ',     value: post.reactions?.likes    ?? 'N/A' },
        { label: 'No me gusta: ',  value: post.reactions?.dislikes ?? 'N/A' },
        { label: 'Vistas: ',       value: post.views ?? 'N/A' },
        { label: 'Tags: ',         value: (post.tags || []).join(', ') || 'Sin tags' },
    ];

    campos.forEach(({ label, value }) => {
        const item = document.createElement('div');
        item.classList.add('detail-meta__item');

        const etiqueta = document.createElement('span');
        etiqueta.classList.add('detail-meta__label');
        etiqueta.textContent = label;

        const valor = document.createElement('span');
        valor.classList.add('detail-meta__value');
        valor.textContent = value;

        item.appendChild(etiqueta);
        item.appendChild(valor);
        metaGrid.appendChild(item);
    });

    const accionesDiv = document.createElement('div');
    accionesDiv.classList.add('detail-acciones');

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.classList.add('btn', 'btn--secondary');
    btnEditar.dataset.id = post.id;
    btnEditar.dataset.action = 'editar';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'eliminar';
    btnEliminar.classList.add('btn', 'btn--danger');
    btnEliminar.dataset.id = post.id;
    btnEliminar.dataset.action = 'eliminar-detalle';

    accionesDiv.appendChild(btnEditar);
    accionesDiv.appendChild(btnEliminar);

    // Ensamblar
    section.appendChild(cabecera);
    section.appendChild(titulo);
    section.appendChild(tagsDiv);
    section.appendChild(cuerpo);
    section.appendChild(metaGrid);
    section.appendChild(accionesDiv);

    document.body.appendChild(section);
};

export const showListView = () => {
    const detail = document.getElementById('detail-section');
    if (detail) detail.remove();

    document.getElementById('posts-container').style.display = '';
    document.getElementById('main-title').style.display = '';
    const filtersEl = document.getElementById('filters-container');
    if (filtersEl) filtersEl.style.display = '';
};
