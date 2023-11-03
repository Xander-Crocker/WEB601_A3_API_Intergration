async function addToCart() {
    const productId = document.getElementById("id").innerText;
    const quantity = document.getElementById("quantity").value;

    // Get all the radio buttons on the page
    const radios = document.querySelectorAll('input[type="radio"]');

    // Create an object to store the selected values
    const selectedValues = [];

    // Loop through each radio button
    radios.forEach(radio => {
        // Get the group name from the radio button's name attribute
        const groupName = radio.name;

        // Get the selected value if the radio button is checked
        if (radio.checked) {
            const selectedValue = radio.value;

            // Add the selected value to the object using the group name as the property name
            selectedValues.push(selectedValue);
        }
    });

    let data = {
        product_id: productId,
        options: selectedValues,
        quantity: quantity,
    }

    await fetch('/api/cart/add', {
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
    }).then((response) => {
        console.log(response);
        if (response.status === 201 || response.status === 200) {
            alert('Item added to the cart.');
        } else {
            alert('Failed to add item to cart.');
        }
    }).catch((err) => {
        console.log(err);
    });
}

// Add a click event listener to the "Add to Cart" button
document.getElementById("add_to_cart").addEventListener("click", addToCart);