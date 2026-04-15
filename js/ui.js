// Estructura base
export const createLayout = () => {
    const titulo = document.createElement('h1');
    titulo.textContent = 'Posts';

    const container = document.createElement('div');
    container.id = 'posts-container';

    document.body.appendChild(titulo);
    document.body.appendChild(container); 
};

// Crear un post
export const createPost = (post) => {
    const article = document.createElement("article");

    const h2 = document.createElement("h2");
    h2.textContent = post.title;

    const boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.classList.add("btn-delete");
    boton.dataset.id = post.id;

    article.appendChild(h2);
    article.appendChild(boton);

    return article;
};

// Renderizar posts
export const renderPosts = (posts) => {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

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