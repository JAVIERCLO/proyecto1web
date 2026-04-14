// Estructura base de la UI
export const createLayout = () => {
    const titulo = document.createElement('h1');
    titulo.textContent = 'Posts';

    const container = document.createElement('div');
    container.id = 'posts-container';

    document.body.appendChild(titulo);
    document.body.appendChild(container); 
};

// Crear un post en el DOM
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

    posts.forEach(post => {
        const elemento = createPost(post);
        container.appendChild(elemento);
    });
};

// Eliminar post del DOM
export const removePostFromDOM = (elemento) => {
    elemento.remove();
};