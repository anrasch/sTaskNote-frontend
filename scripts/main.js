const BACKEND_URL = 'https://stasknote-backend.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const taskForm = document.getElementById('task-form');
    const noteForm = document.getElementById('note-form');
    const logoutButton = document.getElementById('logout-button');
    let token = localStorage.getItem('token') || '';

    if (token) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        loadTasks();
        loadNotes();
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                token = data.token;
                localStorage.setItem('token', token);
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('main-section').style.display = 'block';
                loadTasks();
                loadNotes();
            } else {
                const errorText = await response.text();
                alert(`Login fehlgeschlagen: ${errorText || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            alert(`Login fehlgeschlagen: ${error.message}`);
        }
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Registrierung erfolgreich');
                toggleLogin();
            } else {
                const text = await response.text();
                try {
                    const errorData = JSON.parse(text);
                    alert(`Registrierung fehlgeschlagen: ${errorData.message || 'Unbekannter Fehler'}`);
                } catch {
                    alert(`Registrierung fehlgeschlagen: ${text || 'Unbekannter Fehler'}`);
                }
            }
        } catch (error) {
            alert(`Registrierung fehlgeschlagen: ${error.message}`);
        }
    });

    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;

        try {
            const response = await fetch(`${BACKEND_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ title })
            });

            if (response.ok) {
                loadTasks();
            } else {
                const errorText = await response.text();
                alert(`Fehler beim Hinzufügen der Aufgabe: ${errorText || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            alert(`Fehler beim Hinzufügen der Aufgabe: ${error.message}`);
        }
    });

    noteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const content = document.getElementById('note-content').value;

        try {
            const response = await fetch(`${BACKEND_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                loadNotes();
            } else {
                const errorText = await response.text();
                alert(`Fehler beim Hinzufügen der Notiz: ${errorText || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            alert(`Fehler beim Hinzufügen der Notiz: ${error.message}`);
        }
    });

    logoutButton.addEventListener('click', function() {
        token = '';
        localStorage.removeItem('token');
        document.getElementById('main-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    });

    async function loadTasks() {
        try {
            const response = await fetch(`${BACKEND_URL}/tasks`, {
                headers: { 'x-access-token': token }
            });

            if (response.ok) {
                const tasks = await response.json();
                const taskList = document.getElementById('task-list');
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.textContent = task.title + (task.completed ? ' (erledigt)' : '');
                    taskList.appendChild(li);
                });
            } else {
                const errorText = await response.text();
                alert(`Fehler beim Laden der Aufgaben: ${errorText || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            alert(`Fehler beim Laden der Aufgaben: ${error.message}`);
        }
    }

    async function loadNotes() {
        try {
            const response = await fetch(`${BACKEND_URL}/notes`, {
                headers: { 'x-access-token': token }
            });

            if (response.ok) {
                const notes = await response.json();
                const noteList = document.getElementById('note-list');
                noteList.innerHTML = '';
                notes.forEach(note => {
                    const li = document.createElement('li');
                    li.textContent = note.content;
                    noteList.appendChild(li);
                });
            } else {
                const errorText = await response.text();
                alert(`Fehler beim Laden der Notizen: ${errorText || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            alert(`Fehler beim Laden der Notizen: ${error.message}`);
        }
    }
});

function toggleRegister() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function toggleLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}
