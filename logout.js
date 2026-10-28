
(() => {
    const logoutButton = document.querySelector('#logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', {
                    method: 'POST'
                });

                const data = await response.json().catch(() => ({
                    success: false
                }));

                if (data.success) {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });
    }
})();
