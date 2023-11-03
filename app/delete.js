// Delete user account (on click event)
document.getElementById('delete-account').addEventListener('click', async() => {
    // Get user info from db 
    const userId = document.getElementById('id-input').value;

    // Send delete request to endpoint containing user data
    const response = await fetch('/api/user/delete/'.concat(userId), {
        method: "DELETE",
    });    

    if (response.status === 200 && response.ok === true) { 
        console.log(response);
        alert('Account deleted successfully.')
        window.location.replace('http://localhost:443')
    } else {
        alert('Account deletion failed.')
    }
})   

