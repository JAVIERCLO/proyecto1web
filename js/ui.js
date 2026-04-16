// Estructura base
export const createLayout = () => {
    const titulo = document.createElement('h1');
    titulo.textContent = 'Posts';
    titulo.id = 'main-title';

    const container = document.createElement('div');
    container.id = 'posts-container';
    container.classList.add('card-grid');

    document.body.appendChild(titulo);
    document.body.appendChild(container);
};

 // Crear un post
export const createPost = (post) => {
    const article = document.createElement('article');
    article.classList.add('post-card');

    article.dataset.id = post.id;

    const h2 = document.createElement('h2');
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

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn', 'btn--danger');
    btnEliminar.dataset.id = post.id;
    btnEliminar.dataset.action = 'eliminar';

    acciones.appendChild(btnDetalle);
    acciones.appendChild(btnEliminar);

    article.appendChild(h2);
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

    posts.forEach(post => container.appendChild(createPost(post)));
};

// eliminar del doom 
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

    // boton para abrir el formulario de nueva publicacion
    const btnNuevo = document.createElement('button');
    btnNuevo.textContent = 'Nueva publicacion';
    btnNuevo.classList.add('btn', 'btn--primary', 'btn--nuevo');
    btnNuevo.dataset.action = 'abrir-crear';

    container.appendChild(inputFiltroTexto);
    container.appendChild(inputFiltroAutor);
    container.appendChild(inputFiltroTags);
    container.appendChild(btnNuevo);

    document.body.appendChild(container);
};

const ocultarListado = () => {
    document.getElementById('posts-container').style.display = 'none';
    document.getElementById('main-title').style.display = 'none';
    const f = document.getElementById('filters-container');
    if (f) f.style.display = 'none';
};

export const showListView = () => {
    const detail = document.getElementById('detail-section');
    if (detail) detail.remove();
    const formSection = document.getElementById('form-section');
    if (formSection) formSection.remove();

    document.getElementById('posts-container').style.display = '';
    document.getElementById('main-title').style.display = '';
    const f = document.getElementById('filters-container');
    if (f) f.style.display = '';
};

// ──  Vista de detalle ──────────────────────────────────────
export const showDetailView = (post, user) => {
    ocultarListado();

    const anterior = document.getElementById('detail-section');
    if (anterior) anterior.remove();

    const section = document.createElement('section');
    section.id = 'detail-section';

    // Cabecera con boton volver
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

    const metaGrid = document.createElement('div');
    metaGrid.classList.add('detail-meta');

    const campos = [
        { label: 'ID del post',  value: post.id },
        { label: 'Autor',        value: user ? `${user.firstName} ${user.lastName}` : `Usuario #${post.userId}` },
        { label: 'Usuario',      value: user ? `@${user.username}` : `ID: ${post.userId}` },
        { label: 'Me gusta',     value: post.reactions?.likes    ?? 'N/A' },
        { label: 'No me gusta',  value: post.reactions?.dislikes ?? 'N/A' },
        { label: 'Vistas',       value: post.views ?? 'N/A' },
        { label: 'Tags',         value: (post.tags || []).join(', ') || 'Sin tags' },
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

    //  el boton Editar ahora tiene data-titulo y data-cuerpo
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.classList.add('btn', 'btn--secondary');
    btnEditar.dataset.id     = post.id;
    btnEditar.dataset.action = 'abrir-editar';
    btnEditar.dataset.titulo = post.title;
    btnEditar.dataset.cuerpo = post.body;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn', 'btn--danger');
    btnEliminar.dataset.id     = post.id;
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

// formulario para crear
export const showCreateForm = () => {
    ocultarListado();

    const anterior = document.getElementById('form-section');
    if (anterior) anterior.remove();

    const section = document.createElement('section');
    section.id = 'form-section';

    const cabecera = document.createElement('div');
    cabecera.classList.add('detail-cabecera');
    const btnBack = document.createElement('button');
    btnBack.textContent = 'Volver al listado';
    btnBack.classList.add('btn', 'btn--back');
    btnBack.dataset.action = 'volver';
    cabecera.appendChild(btnBack);

    const titulo = document.createElement('h2');
    titulo.classList.add('form-titulo');
    titulo.textContent = 'Nueva publicacion';

    const form = document.createElement('div');
    form.id = 'post-form';
    form.classList.add('post-form');

    form.appendChild(crearCampo('Titulo', 'form-titulo', 'text', 'Escribe el titulo...'));
    form.appendChild(crearCampoTextarea('Contenido', 'form-cuerpo', 'Escribe el contenido...'));
    form.appendChild(crearCampo('Autor', 'form-autor', 'text', 'Nombre del autor...'));

    const btnEnviar = document.createElement('button');
    btnEnviar.textContent = 'Publicar';
    btnEnviar.classList.add('btn', 'btn--primary', 'btn--submit');
    btnEnviar.dataset.action = 'enviar-crear';

    form.appendChild(btnEnviar);

    section.appendChild(cabecera);
    section.appendChild(titulo);
    section.appendChild(form);
    document.body.appendChild(section);
};

// formulario para editar 

export const showEditForm = (id, tituloActual, cuerpoActual) => {
    ocultarListado();

    const detalle = document.getElementById('detail-section');
    if (detalle) detalle.style.display = 'none';

    const anterior = document.getElementById('form-section');
    if (anterior) anterior.remove();

    const section = document.createElement('section');
    section.id = 'form-section';

    const cabecera = document.createElement('div');
    cabecera.classList.add('detail-cabecera');
    
    const btnBack = document.createElement('button');
    btnBack.textContent = 'Cancelar edicion';
    btnBack.classList.add('btn', 'btn--back');
    btnBack.dataset.action = 'cancelar-editar';
    btnBack.dataset.id = id;
    cabecera.appendChild(btnBack);

    const titulo = document.createElement('h2');
    titulo.classList.add('form-titulo');
    titulo.textContent = 'Editar publicacion';

    const form = document.createElement('div');
    form.id = 'post-form';
    form.classList.add('post-form');
    // Guardar el id del post en el formulario para usarlo al enviar
    form.dataset.id = id;

    const campTitulo   = crearCampo('Titulo', 'form-titulo', 'text', 'Escribe el titulo...');
    const campContenido = crearCampoTextarea('Contenido', 'form-cuerpo', 'Escribe el contenido...');


    campTitulo.querySelector('input').value      = tituloActual;
    campContenido.querySelector('textarea').value = cuerpoActual;

    form.appendChild(campTitulo);
    form.appendChild(campContenido);

    const btnEnviar = document.createElement('button');
    btnEnviar.textContent = 'Guardar cambios';
    btnEnviar.classList.add('btn', 'btn--primary', 'btn--submit');
    btnEnviar.dataset.action = 'enviar-editar';

    form.appendChild(btnEnviar);

    section.appendChild(cabecera);
    section.appendChild(titulo);
    section.appendChild(form);
    document.body.appendChild(section);
};

// Toast de notificaciones
export const showToast = (mensaje, tipo = 'success') => {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast--${tipo}`);
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 2800);
};

const crearCampo = (labelText, inputId, type, placeholder) => {
    const grupo = document.createElement('div');
    grupo.classList.add('form-grupo');

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = labelText;
    label.classList.add('form-label');

    const input = document.createElement('input');
    input.type = type;
    input.id = inputId;
    input.placeholder = placeholder;
    input.classList.add('form-input');

    grupo.appendChild(label);
    grupo.appendChild(input);
    return grupo;
};

const crearCampoTextarea = (labelText, inputId, placeholder) => {
    const grupo = document.createElement('div');
    grupo.classList.add('form-grupo');

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = labelText;
    label.classList.add('form-label');

    const textarea = document.createElement('textarea');
    textarea.id = inputId;
    textarea.placeholder = placeholder;
    textarea.classList.add('form-input', 'form-textarea');
    textarea.rows = 5;

    grupo.appendChild(label);
    grupo.appendChild(textarea);
    return grupo;
};

// Loader para estado de carga
export const showLoader = () => {
    if (document.getElementById('Loader')) return;

    const loader = document.createElement('div');
    loader.id = 'Loader';
    loader.classList.add('Loader');
    loader.innerHTML = `
        <div class="spinner"></div>
        <span>Cargando...</span>
    `;
    document.body.appendChild(loader);
};

// Ocultar loader
export const hideLoader = () => {
    const loader = document.getElementById('Loader');
    if (loader) loader.remove();
};