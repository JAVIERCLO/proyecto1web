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
    showLoader,
    hideLoader,
    renderPaginationControls,
    createNavbar,      
} from './ui.js';
import { validatePostForm, clearErrors } from './validation.js';

// Estado global
let listaDePosts = [];
let filters = { text: '', author: '', tags: '' };
let currentPage = 1;
const postsPerPage = 10;

//  Inicializacion
document.addEventListener('DOMContentLoaded', async () => {
    try {
        createLayout();
        createFilters();

        showLoader();
        const posts = await getPosts();
        listaDePosts = posts;
        createNavbar(listaDePosts);
        updateUI();
        hideLoader();

    } catch (error) {
        console.error('Error al cargar los posts');
        hideLoader();
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

// Actualizar UI con posts paginados
const updateUI = () => {
    const filtered = applyFilters();
    const paginated = paginatePosts(filtered);

    renderPosts(paginated);
    renderPaginationControls(filtered.length, currentPage);
};

// Inputs filtros
document.addEventListener('input', (e) => {
    if (e.target.id === 'filter-text') 
        { filters.text = e.target.value;
            currentPage = 1;
            updateUI();
        }
    if (e.target.id === 'filter-tags') 
        { filters.tags   = e.target.value;
            currentPage = 1;
            updateUI(); }
    if (e.target.id === 'filter-author') 
        { filters.author = e.target.value; 
            currentPage = 1; 
            updateUI(); 
        }
});

// Paginacion
const paginatePosts = (posts) => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return posts.slice(start, end);
};

// clicks
document.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    const id     = e.target.dataset.id;

    // para ver detalles 
    if (action === 'ver-detalle') {
        try {
            showLoader();
            
            const post = await getPostById(id);
            const user = await getUserById(post.userId);

            hideLoader();

            showDetailView(post, user);
        } catch (error) {
            hideLoader();

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
        if (!confirm('¿Seguro que deseas eliminar esta publicación?')) return;

        try {
            
            showLoader();

            await deletePost(id);
            removePostFromDOM(postElement);
            listaDePosts = listaDePosts.filter(p => p.id != id);

            hideLoader();

            showToast('Publicacion eliminada correctamente.');
        } catch (error) {
            hideLoader();

            console.error('Error al eliminar el post');
            showToast('No se pudo eliminar la publicacion.', 'error');
        }
        return;
    }

    // eliminar desde detalle
    if (action === 'eliminar-detalle') {
        if (!id) return;
        try {
            showLoader();

            await deletePost(id);
            listaDePosts = listaDePosts.filter(p => p.id != id);
            showListView();
            updateUI();

            hideLoader();

            showToast('Publicacion eliminada correctamente.');
        } catch (error) {
            hideLoader();

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
        const author  = parseInt(form.querySelector('#form-autor').value.trim());

        try {
            showLoader();

            const nuevoPost = await createPost(titulo, cuerpo, author);

            listaDePosts.unshift(nuevoPost);

            hideLoader();

            showListView();
            updateUI();
            showToast('Publicacion creada correctamente.');
        } catch (error) {
            hideLoader();

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
            showLoader();

            const post = await getPostById(id);
            const user = await getUserById(post.userId);

            hideLoader();

            showDetailView(post, user);
        } catch {
            hideLoader();

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
            showLoader();

            const postActualizado = await updatePost(postId, titulo, cuerpo);

            const idx = listaDePosts.findIndex(p => p.id == postId);
            if (idx !== -1) {
                listaDePosts[idx] = { ...listaDePosts[idx], title: titulo, body: cuerpo };
            }

            const formSection = document.getElementById('form-section');
            if (formSection) formSection.remove();

            const user = await getUserById(listaDePosts[idx]?.userId ?? postActualizado.userId);

            hideLoader();

            showDetailView({ ...postActualizado, tags: listaDePosts[idx]?.tags || [] }, user);
            showToast('Publicacion actualizada correctamente.');
        } catch (error) {
            hideLoader();

            console.error('Error al actualizar el post');
            showToast('No se pudo actualizar la publicacion.', 'error');
        }
        return;
    }

    // navegación inicio
    if (action === 'nav-inicio') {
        filters = { text: '', author: '', tags: '' };
        currentPage = 1;
        showListView();
        updateUI();
        return;
    }

    // navegación crear
    if (action === 'nav-crear') {
        showCreateForm();
        return;
    }

    // navegación por autor (RF-08)
    if (action === 'nav-ordenar-autores') {
        const ordenados = [...listaDePosts].sort((a, b) => a.userId - b.userId);

        currentPage = 1;
        showListView();

        renderPosts(paginatePosts(ordenados));
        renderPaginationControls(ordenados.length, currentPage);

        return;
    }

    // paginacion
    if (action === 'next-page') {
        if (currentPage < Math.ceil(applyFilters().length / postsPerPage)) {
            currentPage++;
            updateUI();
            return;
        }
    }

    if (action === 'prev-page') {
        if (currentPage > 1) {
            currentPage--;
            updateUI();
            return;
        }
    }
});
