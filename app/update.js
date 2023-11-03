// Update user password
document.getElementById('update-password').addEventListener('click', async() => {

    // Get user info from db
    const userId = document.getElementById('id-input').value;
    data = {
        password: document.getElementById('password-input').value
    } 

    // Send put request to endpoint containing user data
    const response = await fetch('/api/user/update/'.concat(userId), {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrerPolicy: "same-origin",
        body: JSON.stringify(data)
    });
    
    if (response.status === 201 && response.ok === true) {
        alert('Password changed successfully.')
        window.location.replace('http://localhost:443')
    }
}) 