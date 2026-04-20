document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('ajax-save-button');
    const messageBox = document.getElementById('ajax-profile-message');
    const nombreInput = document.getElementById('nombre');
    const matriculaInput = document.getElementById('matricula');
    const correoInput = document.getElementById('correo');
    const csrfInput = document.getElementById('ajax-csrf');

    if (!saveButton || !messageBox || !csrfInput) {
        return;
    }

    saveButton.addEventListener('click', async () => {
        const payload = {
            nombre: nombreInput ? nombreInput.value : '',
            matricula: matriculaInput ? matriculaInput.value : '',
            correo: correoInput ? correoInput.value : '',
        };

        messageBox.textContent = 'Guardando cambios...';
        messageBox.className = 'ajax-message ajax-message-loading';

        try {
            const response = await fetch('/usuarios/perfil/ajax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'csrf-token': csrfInput.value,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo actualizar el perfil');
            }

            messageBox.textContent = data.message;
            messageBox.className = 'ajax-message ajax-message-success';
        } catch (error) {
            messageBox.textContent = error.message;
            messageBox.className = 'ajax-message ajax-message-error';
        }
    });
});
