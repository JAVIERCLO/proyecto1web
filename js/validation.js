
export const clearErrors = (formEl) => {
    formEl.querySelectorAll('.field-error').forEach(el => el.remove());
    formEl.querySelectorAll('.input--error').forEach(el => el.classList.remove('input--error'));
};

const showFieldError = (inputEl, mensaje) => {
    inputEl.classList.add('input--error');
    const error = document.createElement('span');
    error.classList.add('field-error');
    error.textContent = mensaje;
    inputEl.insertAdjacentElement('afterend', error);
};

export const validatePostForm = (formEl) => {
    clearErrors(formEl);

    const tituloEl   = formEl.querySelector('#form-titulo');
    const cuerpoEl   = formEl.querySelector('#form-cuerpo');
    const autorEl    = formEl.querySelector('#form-autor');

    let valido = true;

    // Validacion del titulo: obligatorio y minimo 5 caracteres
    if (!tituloEl.value.trim()) {
        showFieldError(tituloEl, 'El titulo es obligatorio.');
        valido = false;
    } else if (tituloEl.value.trim().length < 5) {
        showFieldError(tituloEl, 'El titulo debe tener al menos 5 caracteres.');
        valido = false;
    }

    // Validacion del cuerpo: obligatorio y minimo 20 caracteres
    if (!cuerpoEl.value.trim()) {
        showFieldError(cuerpoEl, 'El contenido es obligatorio.');
        valido = false;
    } else if (cuerpoEl.value.trim().length < 20) {
        showFieldError(cuerpoEl, 'El contenido debe tener al menos 20 caracteres.');
        valido = false;
    }

    // El campo autor solo se valida en creacion (no aparece en edicion)
    if (autorEl) {
        const valor = autorEl.value.trim();

        if (!valor) {
            showFieldError(autorEl, 'El ID del autor es obligatorio.');
            valido = false;
        } else if (isNaN(valor)) {
            showFieldError(autorEl, 'El ID del autor debe ser un número.');
            valido = false;
        }
    }

    return valido;
};
