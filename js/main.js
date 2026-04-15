import { deletePost, getPosts } from './api.js';
import { removePostFromDOM, createLayout, renderPosts, createFilters } from './ui.js';

// Variables globales
let listaDePosts = [];
let filters = {
    text : '',
    author : '',
    tags : ''
};

// Inicialización de la página web
document.addEventListener('DOMContentLoaded', async () => {
    try {
        createLayout();
        createFilters();

        const posts = await getPosts();
        listaDePosts = posts; // guardar posts para filtros

        renderPosts(posts);

    } catch (error) {
        console.error('Error al cargar los posts');
    }
});

// Filtros de busqueda
const applyFilters = () => {
    return listaDePosts.filter(post => {

        // Filtro por texto
        const textMatch = post.title.toLowerCase().includes(filters.text.toLowerCase()) ||
            post.body.toLowerCase().includes(filters.text.toLowerCase());

        // Filtro por autor
        const authorMatch = filters.author === '' || post.userId == filters.author;

        // Filtro por tags
        const tagsMatch = filters.tags === '' ||
            post.tags.some(tag =>
                tag.toLowerCase().includes(filters.tags.toLowerCase())
            );

        return textMatch && authorMatch && tagsMatch;
    });
};

// Actualizar UI con filtros aplicados
const updateUI = () => {
    const filtered = applyFilters();
    renderPosts(filtered);
};

// Delete post event listener
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-delete')) {

        const id = e.target.dataset.id;
        const postElement = e.target.closest('article');

        if (!id || !postElement) return;

        try {
            await deletePost(id);
            removePostFromDOM(postElement);

        } catch (error) {
            console.error('Error al eliminar el post');
        }
    }
});

// Busqueda por texto, autor o tags event listener
document.addEventListener('input', (e) => {

    if (e.target.id === 'filter-text') {
        filters.text = e.target.value;
        updateUI();
    }

    if (e.target.id === 'filter-tags') {
        filters.tags = e.target.value;
        updateUI();
    }

    if (e.target.id === 'filter-author') {
        filters.author = e.target.value;
        updateUI();
    }
});