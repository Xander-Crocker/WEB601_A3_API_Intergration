require("dotenv").config();
const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")(process.env.STRIPE_API_KEY);


// code template copied from https://dashboard.stripe.com/webhooks/create?events=checkout.session.completed - requires stripe account
router.post('/webhook', express.raw({type: 'application/json'}),async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_TEST_KEY);
        const data = event.data.object;
        

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                     
                let cart_id = data.metadata.cart_id;
                await axios.get(process.env.SERVER_URL.concat('api/cart/one/').concat(cart_id)).then(async (response) => {
                    if (response.data.cart) {
                        let cart = response.data.cart;


                        console.log('Cart:', cart);
                        
                        let order = {};
                        order.line_items = cart.line_items;
                        order.address_to = {};
                        order.address_to.country = data.shipping_details.address.country;
                        order.address_to.region = data.shipping_details.address.city;
                        order.address_to.city = data.shipping_details.address.city;
                        order.address_to.address1 = data.shipping_details.address.line1;
                        order.address_to.address2 = data.shipping_details.address.line2 || null;
                        order.address_to.zip = data.shipping_details.address.postal_code;
                        order.address_to.phone = data.customer_details.phone || null;
                        order.address_to.first_name = data.customer_details.name.split(' ')[0]|| null;
                        order.address_to.last_name = data.customer_details.name.split(' ')[1] || null;
                        order.address_to.email = data.customer_details.email || null;
                        order.shipping_method = 1;
                        order.external_id = uuidv4()

                        console.log('Order:', order);

                        // find user by unique email and add user id to order

                        await axios.post(process.env.SERVER_URL.concat('api/order/create'), order).then((response) => {
                            console.log(response.data);
                            if (response.status === 201) {
                                console.log('Order created successfully');
                            } else {
                                console.log('Order not created');
                            }
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else {
                        console.log('Cart not found');
                    }

                    await axios.delete(process.env.SERVER_URL.concat('api/cart/delete/').concat(cart_id)).then((response) => {
                        console.log(response.data);
                        if (response.status === 200) {
                            console.log('Cart deleted successfully');
                        } else {
                            console.log('Cart not deleted');
                        }
                    }).catch((error) => {
                        console.log(error);
                    });

                    req.session.cart = null;
                }).catch((error) => {
                    console.log(error);
                });

                // Then define and call a function to handle the event checkout.session.completed
                // Use axios to send a request to the create order route
                break;

            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);

                // Return a 200 response to acknowledge receipt of the event
        }
        res.send();
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        // console.log(err.message);
        return;
    }
});

module.exports = router;