// URL base de la API para los posts
const BASE_URL = 'https://dummyjson.com/posts';

// Get un post por su ID
export const getPosts = async () => {
    try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error('Error al obtener posts');
        }

        const data = await response.json();
        return data.posts;

    } catch (error) {
        console.error(error);
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