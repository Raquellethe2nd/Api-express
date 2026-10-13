async function loadMessages() {
    const listError = document.querySelector('#list-error');
    listError.textContent = '';

    try {
        const response = await fetch('/api/guestbook');
        const entries = await response.json().catch(() => ({}));

        if (!response.ok) {
            listError.textContent = Data.error || 'could not load messages';
            return;
        }

        const list = document.querySelector('#guestbook-list');
        list.innerHTML = '';
        [...entries].reverse().forEach(entry => {
            const li = document.createElement('li');

            const name = document.createElement('strong');
            name.textContent = entry.name;

            const date = document.createElement('small');
            date.textContent = new Date(entry.createdAt).toLocaleString();

            const msg = document.createElement('p');
            msg.textContent = entry.msg;

            li.append(name, ' ', date, msg);
            list.append(li);
        });
    } catch (err) {
        listError.textContent = 'could not reach the server. check your connection.';
    }
}


document.querySelector('#guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
            name: document.querySelector('#name').value,
            msg: document.querySelector('#msg').value
        })

    });
    e.target.reset();
    loadMessages(); // refresh the list without reloading the page
});

loadMessages(); 