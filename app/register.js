// Register user (on click event)
document.getElementById('register-btn').addEventListener('click', async() => {
    // Get user input from input form
    data = {
        email: document.getElementById('email-input').value,
        given_name: document.getElementById('firstName-input').value,
        family_name: document.getElementById('surname-input').value,
        username: document.getElementById('username-input').value,
        password: document.getElementById('password-input').value
    }

    // Send post request to login endpoint containing user data
    const response = await fetch('/api/user/register', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrerPolicy: "same-origin",
        body: JSON.stringify(data),
    });

    if (response.status === 201 && response.ok === true) {
        alert('Registration successful.')
        window.location.replace('http://localhost:443')
    } else {
        alert('Registration failed.')
    }
})
