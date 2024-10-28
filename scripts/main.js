const BACKEND_URL = 'https://stasknote.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const taskForm = document.getElementById('task-form');
    const noteForm = document.getElementById('note-form');
    let token = '';

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('main-section').style.display = 'block';
            loadTasks();
            loadNotes();
        } else {
            alert('Login fehlgeschlagen');
        }
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Registrierung erfolgreich');
            toggleLogin();
        } else {
            alert('Registrierung fehlgeschlagen');
        }
    });

    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;

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
            alert('Fehler beim Hinzufügen der Aufgabe');
        }
    });

    noteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const content = document.getElementById('note-content').value;

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
            alert('Fehler beim Hinzufügen der Notiz');
        }
    });

    async function loadTasks() {
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
        }
    }

    async function loadNotes() {
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
