// Login user (on click event)
document.getElementById('login-btn').addEventListener('click', async() => {
    // Get user info from db
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    // Send post request to endpoint containing user data
    const response = await fetch('/api/user/login', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { 
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrerPolicy: "same-origin",
        body: JSON.stringify({username: username, password: password})
    });

    if (response.status === 200 && response.ok === true) {
        alert('Login successful.')
        window.location.replace('http://localhost:443')
    } else {
        alert('Login failed.')
    }
})