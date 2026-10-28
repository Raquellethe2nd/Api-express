const loginForm = document.querySelector('#login-form'); const loginMessage = document.querySelector('#login-message'); const status = document.querySelector('#status'); const loginSection = document.querySelector('#login-section'); const logoutButton = document.querySelector('#logout-button');

async function checkAuthState() {
    try {
        const response = await fetch('/api/whoami'); const data = await response.json();

        status.replaceChildren();

        if (data.loggedIn) {
            const heading = document.createElement('h1');
            heading.textContent = `Welcome back${data.username ? `, ${data.username}` : ''}!`;
            status.appendChild(heading);

            if (data.role === 'admin') {
                const link = document.createElement('a');
                link.href = '/dashboard';
                link.textContent = 'Dashboard';
                status.appendChild(link);
            }

            loginSection.hidden = true;
            logoutButton.hidden = false;
        } else {
            loginSection.hidden = false;
            logoutButton.hidden = true;
        }
    } catch (error) {
        status.replaceChildren();
        loginSection.hidden = false;
        logoutButton.hidden = true;
        loginMessage.textContent = 'Could not check login status. Please try again.';
    }


}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = loginForm.elements.username.value.trim();
    const password = loginForm.elements.password.value;
    const rememberMe = loginForm.elements.rememberMe?.checked ?? false;

    loginMessage.textContent = '';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                rememberMe
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
            loginMessage.textContent =
                data.error || 'Login failed. Check your username and password.';
            return;
        }

        loginForm.reset();
        window.location.href = data.redirect || '/';
    } catch (error) {
        loginMessage.textContent = 'Could not reach the server. Try again.';
    }


});

checkAuthState();