const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const status = document.querySelector('#status');
const loginSection = document.querySelector('#login-section');
const logoutButton = document.querySelector('#logout-button');

async function checkAuthState() {
    try {
        const response = await fetch('/api/whoami');
        const data = await response.json();

        if (data.loggedIn) {
            status.textContent = '';

            const heading = document.createElement('h1');
            heading.textContent = `Welcome back, ${data.username}!`;
            status.append(heading);

            if (data.role === 'admin') {
                const link = document.createElement('a');
                link.href = '/dashboard';
                link.textContent = 'Dashboard';
                status.append(link);
            }

            loginSection.hidden = true;
            logoutButton.hidden = false;
        } else {
            status.textContent = 'Welcome!';
            loginSection.hidden = false;
            logoutButton.hidden = true;
        }
    } catch (error) {
        status.textContent = 'Welcome!';
        loginSection.hidden = false;
        logoutButton.hidden = true;
    }
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const rememberMe = loginForm.elements.rememberMe?.checked ?? false;

    try {
        const response = await fetch(loginForm.action || '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rememberMe })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
            loginMessage.textContent = 'Login successful!';
            loginForm.reset();
            await checkAuthState();
            window.location.href = data.redirect || '/';
        } else {
            loginMessage.textContent =
                data.error || 'Login failed. Check your username and password.';
        }
    } catch (error) {
        loginMessage.textContent = 'Could not reach the server. Try again.';
    }
});

checkAuthState();