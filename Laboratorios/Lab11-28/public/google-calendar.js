const initGoogleCalendarIntegration = () => {
    const root = document.getElementById('calendar-api-root');
    const authorizeButton = document.getElementById('calendar-authorize');
    const signoutButton = document.getElementById('calendar-signout');
    const statusBox = document.getElementById('calendar-status');
    const eventsList = document.getElementById('calendar-events');
    const missingConfigBox = document.getElementById('calendar-missing-config');

    if (!root || !authorizeButton || !signoutButton || !statusBox || !eventsList || !missingConfigBox) {
        return;
    }

    authorizeButton.textContent = 'Cargando Google Calendar...';

    const config = {
        apiKey: root.dataset.apiKey || '',
        clientId: root.dataset.clientId || '',
        discoveryDoc: root.dataset.discoveryDoc || '',
        scope: root.dataset.scope || '',
        calendarId: root.dataset.calendarId || 'primary',
    };

    const hasConfig = Boolean(config.apiKey && config.clientId);
    let tokenClient;
    let gapiReady = false;
    let gisReady = false;

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
            document.head.appendChild(script);
        });
    };

    const setStatus = (message, className) => {
        statusBox.textContent = message;
        statusBox.className = `calendar-message ${className}`;
    };

    const setDebug = (message) => {
        console.log(`[Google Calendar] ${message}`);
        setStatus(message, 'blue lighten-5');
    };

    const renderEvents = (events) => {
        eventsList.innerHTML = '';

        if (!events.length) {
            eventsList.innerHTML = `
                <li class="collection-item">
                    No hay eventos próximos en el calendario seleccionado.
                </li>`;
            return;
        }

        events.forEach((event) => {
            const start = event.start.dateTime || event.start.date || 'Sin fecha';
            const item = document.createElement('li');
            item.className = 'collection-item';
            item.innerHTML = `
                <span class="calendar-event-title">${event.summary || 'Evento sin título'}</span>
                <p class="calendar-event-meta">${start}</p>
            `;
            eventsList.appendChild(item);
        });
    };

    const updateButtons = (signedIn) => {
        authorizeButton.textContent = 'Conectar Google Calendar';
        authorizeButton.style.display = signedIn ? 'none' : 'inline-flex';
        signoutButton.style.display = signedIn ? 'inline-flex' : 'none';
    };

    const maybeEnableAuth = () => {
        if (!hasConfig || !gapiReady || !gisReady) {
            return;
        }

        setDebug('Listo para conectar con Google Calendar.');
        authorizeButton.disabled = false;
    };

    const listUpcomingEvents = async () => {
        setDebug('Consultando próximos eventos...');

        try {
            const response = await gapi.client.calendar.events.list({
                calendarId: config.calendarId,
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: 'startTime',
            });

            renderEvents(response.result.items || []);
            setStatus('Eventos cargados correctamente desde Google Calendar.', 'green lighten-5');
        } catch (error) {
            renderEvents([]);
            setStatus(`No se pudieron cargar los eventos: ${error.message}`, 'red lighten-5');
        }
    };

    const initGapi = async () => {
        setDebug('Inicializando cliente gapi...');
        gapi.load('client', async () => {
            await gapi.client.init({
                apiKey: config.apiKey,
                discoveryDocs: [config.discoveryDoc],
            });

            gapiReady = true;
            setDebug('gapi cargado correctamente.');
            maybeEnableAuth();
        });
    };

    const initGis = () => {
        setDebug('Inicializando Google Identity Services...');
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: config.clientId,
            scope: config.scope,
            ux_mode: 'popup',
            callback: async (tokenResponse) => {
                if (tokenResponse.error) {
                    setStatus(`La autorización falló: ${tokenResponse.error}`, 'red lighten-5');
                    return;
                }

                setDebug('Autorización recibida. Cargando eventos...');
                updateButtons(true);
                await listUpcomingEvents();
            },
        });

        gisReady = true;
        setDebug('Google Identity Services cargado correctamente.');
        maybeEnableAuth();
    };

    authorizeButton.disabled = true;
    updateButtons(false);

    if (!hasConfig) {
        missingConfigBox.style.display = 'block';
        setStatus('La integración está preparada, pero faltan credenciales de Google.', 'amber lighten-5');
        return;
    }

    missingConfigBox.style.display = 'none';
    setDebug('Cargando bibliotecas de Google...');

    Promise.all([
        loadScript('https://apis.google.com/js/api.js'),
        loadScript('https://accounts.google.com/gsi/client'),
    ])
    .then(async () => {
        await initGapi();
        initGis();
    })
    .catch((error) => {
        setStatus(error.message, 'red lighten-5');
    });

    authorizeButton.addEventListener('click', () => {
        setDebug('Botón presionado. Intentando abrir autorización...');

        if (!tokenClient) {
            setStatus('Google Calendar aún no termina de cargar. Intenta de nuevo en un momento.', 'amber lighten-5');
            return;
        }

        try {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (error) {
            setStatus(`No se pudo iniciar la autorización: ${error.message}`, 'red lighten-5');
        }
    });

    signoutButton.addEventListener('click', () => {
        const token = gapi.client.getToken();

        if (token) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }

        eventsList.innerHTML = '';
        updateButtons(false);
        setStatus('Sesión de Google cerrada.', 'grey lighten-4');
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleCalendarIntegration);
} else {
    initGoogleCalendarIntegration();
}
