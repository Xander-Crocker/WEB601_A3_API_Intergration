document.getElementById('pay_btn').addEventListener('click', async() => {
   
    await fetch('api/cart/create-checkout-session', {
        method: 'GET'
    }).then((response) => {
        console.log(response);
        if (response.status === 200) {
            response.json().then((data) => {
                window.location.href = data.url;
            });
        } else {
            alert('Failed to create checkout session.');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });

});


// use query selector to get all elements with class fa-minus
const quantityBtns = document.querySelectorAll('.fas');

// for each button, add an event listener
quantityBtns.forEach((btn) => {
    btn.addEventListener('click', async(event) => {
        const container = event.target.parentElement.parentElement;

        // get the product id from the id of the parent div
        const [product_id, variant_id] = container.parentElement.id.split('-')  ;
        const quantity_input = container.querySelector('.quantity_input');
        if (event.target.classList.contains('fa-plus')) {
            quantity_input.value = parseInt(quantity_input.value) + 1;
        } else if (event.target.classList.contains('fa-minus')) {
            quantity_input.value = parseInt(quantity_input.value) - 1;
        } else {
            return;
        }
        const quantity = quantity_input.value;

        // make a fetch request to update the quantity
        await fetch(`/api/cart/update/${product_id}/${variant_id}/quantity`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: quantity }),
        }).then((response) => {
            // console.log(response);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Failed to update cart.');
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    });
});

// use query selector to get all elements with class remove
const removeBtns = document.querySelectorAll('.remove_product');



// for each button, add an event listener
removeBtns.forEach((btn) => {
    btn.addEventListener('click', async(event) => {
        const container = event.target.parentElement.parentElement;

        // get the product id from the id of the parent div
        const [product_id, variant_id] = container.parentElement.id.split('-')  ;

        // make a fetch request to update the quantity
        await fetch(`/api/cart/update/${product_id}/${variant_id}/quantity`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 0 }),
        }).then((response) => {
            // console.log(response);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Failed to update cart.');
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    });
});


// use query selector to get all elements with class quantity_input
const quantityInputs = document.querySelectorAll('.quantity_input');

// for each input, add an event listener
quantityInputs.forEach((input) => {
    input.addEventListener('change', async(event) => {
        const container = event.target.parentElement;

        // get the product id from the id of the parent div
        const [product_id, variant_id] = container.parentElement.id.split('-')  ;
        const quantity = event.target.value;

        // make a fetch request to update the quantity
        await fetch(`/api/cart/update/${product_id}/${variant_id}/quantity`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: quantity }),
        }).then((response) => {
            // console.log(response);
            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Failed to update cart.');
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    });
});


// use getElementById to get the empty cart button
const emptyCartBtn = document.getElementById('empty_cart');

emptyCartBtn.addEventListener('click', async() => {
    await fetch('/api/cart/delete', {
        method: 'DELETE'
    }).then((response) => {
        if (response.status === 200) {
            window.location.reload();
        } else {
            alert('Failed to empty cart.');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
});