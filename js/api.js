// URL base de la API para los posts
const BASE_URL = 'https://dummyjson.com/posts';
const USERS_URL = 'https://dummyjson.com/users';

// GET todos los posts
export const getPosts = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Error al obtener posts');
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get un post por su ID
export const getPostById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el post');
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo el post:', error);
        throw error;
    }
};

// GET usuario por ID (RF-02)
export const getUserById = async (id) => {
    try {
        const response = await fetch(`${USERS_URL}/${id}`);
        if (!response.ok) throw new Error('Error al obtener el usuario');
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo el usuario:', error);
        throw error;
    }
};


// Delete un post por su ID
export const deletePost = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el post');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error borrando el post: ', error);
        throw error;

    }
}
// POST nuevo
export const createPost = async (titulo, cuerpo, autor) => {
    try {
        const response = await fetch(BASE_URL + '/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: titulo,
                body: cuerpo,
                userId: autor,
                tags: [],
                reactions: { likes: 0, dislikes: 0 },
            }),
        });
        if (!response.ok) throw new Error('Error al crear el post');
        return await response.json();
    } catch (error) {
        console.error('Error creando el post:', error);
        throw error;
    }
};

//actualizar un post existente
export const updatePost = async (id, titulo, cuerpo) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titulo, body: cuerpo }),
        });
        if (!response.ok) throw new Error('Error al actualizar el post');
        return await response.json();
    } catch (error) {
        console.error('Error actualizando el post:', error);
        throw error;
    }
};