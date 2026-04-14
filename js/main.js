import { deletePost, getPosts } from './api.js';
import { removePostFromDOM, createLayout, renderPosts } from './ui.js';

// Inicialización de la página web
document.addEventListener('DOMContentLoaded', async () => {
    try {
        createLayout();

        const posts = await getPosts();
        renderPosts(posts);

    } catch (error) {
        console.error('Error al cargar los posts');
    }
});

// Delete post event listener
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-delete')) {

        const id = e.target.dataset.id;
        const postElement = e.target.closest('article');

        // 🔒 Validación extra (evita errores raros)
        if (!id || !postElement) return;

        try {
            await deletePost(id);
            removePostFromDOM(postElement);

        } catch (error) {
            console.error('Error al eliminar el post');
        }
    }
});