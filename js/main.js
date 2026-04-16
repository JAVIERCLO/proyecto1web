import { deletePost, getPosts, getPostById, getUserById, createPost, updatePost } from './api.js';
import {
    removePostFromDOM,
    createLayout,
    renderPosts,
    createFilters,
    showDetailView,
    showListView,
    showCreateForm,  
    showEditForm,    
    showToast,      
} from './ui.js';
import { validatePostForm, clearErrors } from './validation.js';

// Estado global
let listaDePosts = [];
let filters = { text: '', author: '', tags: '' };

//  Inicializacion
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

// filtros
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

const updateUI = () => renderPosts(applyFilters());

// Inputs filtros
document.addEventListener('input', (e) => {
    if (e.target.id === 'filter-text')   { filters.text   = e.target.value; updateUI(); }
    if (e.target.id === 'filter-tags')   { filters.tags   = e.target.value; updateUI(); }
    if (e.target.id === 'filter-author') { filters.author = e.target.value; updateUI(); }
});

// clicks
document.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    const id     = e.target.dataset.id;

    // para ver detalles 
    if (action === 'ver-detalle') {
        try {
            const post = await getPostById(id);
            const user = await getUserById(post.userId);
            showDetailView(post, user);
        } catch (error) {
            console.error('Error al cargar el detalle');
            showToast('No se pudo cargar el detalle.', 'error');
        }
        return;
    }

    // 
    if (action === 'volver') {
        showListView();
        return;
    }

    // regresar
    if (action === 'eliminar') {
        const postElement = e.target.closest('article');

        if (!id || !postElement) return;

        try {
            await deletePost(id);
            removePostFromDOM(postElement);
            listaDePosts = listaDePosts.filter(p => p.id != id);
            showToast('Publicacion eliminada correctamente.');
        } catch (error) {
            console.error('Error al eliminar el post');
            showToast('No se pudo eliminar la publicacion.', 'error');
        }
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
            showToast('Publicacion eliminada correctamente.');
        } catch (error) {
            console.error('Error al eliminar el post desde detalle');
            showToast('No se pudo eliminar la publicacion.', 'error');
        }
        return;
    }

    // abrir formulario de creacion
    if (action === 'abrir-crear') {
        showCreateForm();
        return;
    }

    // enviar formulario de creacion
    if (action === 'enviar-crear') {
        const form = document.getElementById('post-form');
        if (!validatePostForm(form)) return; 

        const titulo = form.querySelector('#form-titulo').value.trim();
        const cuerpo = form.querySelector('#form-cuerpo').value.trim();
        const autor  = form.querySelector('#form-autor').value.trim();

        try {
            const nuevoPost = await createPost(titulo, cuerpo, autor);

            listaDePosts.unshift(nuevoPost);

            showListView();
            renderPosts(applyFilters());
            showToast('Publicacion creada correctamente.');
        } catch (error) {
            console.error('Error al crear el post');
            showToast('No se pudo crear la publicacion.', 'error');
        }
        return;
    }

    // abrir formulario de edicion
    if (action === 'abrir-editar') {
        const tituloActual = e.target.dataset.titulo;
        const cuerpoActual = e.target.dataset.cuerpo;
        showEditForm(id, tituloActual, cuerpoActual);
        return;
    }

    // cancelar edicion y volver al detalle
    if (action === 'cancelar-editar') {
        const formSection = document.getElementById('form-section');
        if (formSection) formSection.remove();

        try {
            const post = await getPostById(id);
            const user = await getUserById(post.userId);
            showDetailView(post, user);
        } catch {
            showListView();
        }
        return;
    }

    // enviar formulario de edicion
    if (action === 'enviar-editar') {
        const form   = document.getElementById('post-form');
        const postId = form.dataset.id;
        if (!validatePostForm(form)) return; 

        const titulo = form.querySelector('#form-titulo').value.trim();
        const cuerpo = form.querySelector('#form-cuerpo').value.trim();

        try {
            const postActualizado = await updatePost(postId, titulo, cuerpo);

            const idx = listaDePosts.findIndex(p => p.id == postId);
            if (idx !== -1) {
                listaDePosts[idx] = { ...listaDePosts[idx], title: titulo, body: cuerpo };
            }

            const formSection = document.getElementById('form-section');
            if (formSection) formSection.remove();

            const user = await getUserById(listaDePosts[idx]?.userId ?? postActualizado.userId);
            showDetailView({ ...postActualizado, tags: listaDePosts[idx]?.tags || [] }, user);
            showToast('Publicacion actualizada correctamente.');
        } catch (error) {
            console.error('Error al actualizar el post');
            showToast('No se pudo actualizar la publicacion.', 'error');
        }
        return;
    }
});