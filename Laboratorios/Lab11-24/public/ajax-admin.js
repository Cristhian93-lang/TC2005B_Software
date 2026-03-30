document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.ajax-role-form');

    if (!forms.length) {
        return;
    }

    forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const row = form.closest('[data-user-row]');
            const messageBox = row ? row.querySelector('.admin-row-message') : null;
            const badge = row ? row.querySelector('[data-role-badge]') : null;

            if (messageBox) {
                messageBox.textContent = 'Actualizando rol...';
                messageBox.className = 'admin-row-message ajax-message-loading';
            }

            try {
                const response = await fetch('/usuarios/admin/rol/ajax', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'csrf-token': formData.get('_csrf'),
                    },
                    body: JSON.stringify({
                        id_usuario: formData.get('id_usuario'),
                        id_rol: formData.get('id_rol'),
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'No se pudo actualizar el rol');
                }

                if (badge) {
                    badge.textContent = data.rol;
                    badge.className = `role-badge role-${data.rol}`;
                }

                if (messageBox) {
                    messageBox.textContent = data.message;
                    messageBox.className = 'admin-row-message ajax-message-success';
                }
            } catch (error) {
                if (messageBox) {
                    messageBox.textContent = error.message;
                    messageBox.className = 'admin-row-message ajax-message-error';
                }
            }
        });
    });
});
