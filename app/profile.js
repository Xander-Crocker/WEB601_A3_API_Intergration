async function updateProductName(){

    // Get product info from db
    const productId = document.getElementById("id").innerText;
    console.log(productId)

    // Send put request to endpoint containing user data
    await fetch(`/api/product/update/${productId}`, {
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
        alert('Product name has changed successfully.')
        window.location.replace('http://localhost:443')
    }
}

// Add a click event listener to the "Change the name of a product" button
document.getElementById("update-product-btn").addEventListener("click", updateProductName);