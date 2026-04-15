import { deletePost, getPosts, getPostById, getUserById } from './api.js';
import {
    removePostFromDOM,
    createLayout,
    renderPosts,
    createFilters,
    showDetailView,
    showListView,
} from './ui.js';

// Variables globales
let listaDePosts = [];
let filters = {
    text: '',
    author: '',
    tags: ''
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    try {
        createLayout();
        createFilters();

        const posts = await getPosts();
        listaDePosts = posts;

        renderPosts(posts);

    } catch (error) {
        console.error('Error al cargar los posts');
    }
});

// Filtros
const applyFilters = () => {
    return listaDePosts.filter(post => {

        const textMatch =
            post.title.toLowerCase().includes(filters.text.toLowerCase()) ||
            post.body.toLowerCase().includes(filters.text.toLowerCase());

        const authorMatch =
            filters.author === '' || post.userId == filters.author;

        const tagsMatch =
            filters.tags === '' ||
            (post.tags || []).some(tag =>
                tag.toLowerCase().includes(filters.tags.toLowerCase())
            );

        return textMatch && authorMatch && tagsMatch;
    });
};

// Actualizar UI
const updateUI = () => {
    renderPosts(applyFilters());
};

// Inputs filtros
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

// Clicks
document.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;

    // VER DETALLE
    if (action === 'ver-detalle') {
        try {
            const post = await getPostById(id);
            const user = await getUserById(post.userId);
            showDetailView(post, user);
        } catch (error) {
            console.error('Error al cargar el detalle');
        }
        return;
    }

    //  ELIMINAR
    if (action === 'eliminar') {
        const postElement = e.target.closest('article');

        if (!id || !postElement) return;

        try {
            await deletePost(id);
            removePostFromDOM(postElement);
        } catch (error) {
            console.error('Error al eliminar el post');
        }
        return;
    }

    //volver
    if (action === 'volver') {
        showListView();
        return;
    }

    // eliminar desde detalle
    if (action === 'eliminar-detalle') {
        if (!id) return;
        try {
            await deletePost(id);
            listaDePosts = listaDePosts.filter(p => p.id != id);
            showListView();
            renderPosts(applyFilters());
        }
        catch (error) {
            console.error('Error al eliminar el post desde detalle');
        }  
        return;
    }
});