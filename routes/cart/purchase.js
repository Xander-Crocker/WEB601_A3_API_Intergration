require("dotenv").config();
const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const base_url = process.env.SERVER_URL;
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

router.get("/create-checkout-session", async (req, res) => {
    try {
        await axios.get(base_url.concat('api/cart/one/'.concat(req.session.cart))).then(async (response) => {
            if (response.data.cart) {       
                let cart = response.data.cart;

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    billing_address_collection: 'required',
                    shipping_address_collection: {
                        allowed_countries: ['NZ'],
                    },
                    metadata: {
                        cart_id: cart._id
                    },
                    phone_number_collection: {
                        enabled: true,
                    },
                    shipping_options: [
                        {
                            shipping_rate_data: {
                                type: 'fixed_amount',
                                fixed_amount: {
                                    amount: 0,
                                    currency: 'nzd',
                                },
                                display_name: 'Free shipping',
                                delivery_estimate: {
                                    minimum: {
                                        unit: 'business_day',
                                        value: 5,
                                    },
                                    maximum: {
                                        unit: 'business_day',
                                        value: 7,
                                    },
                                },
                            },
                        },
                        {
                            shipping_rate_data: {
                                type: 'fixed_amount',
                                fixed_amount: {
                                    amount: 1500,
                                    currency: 'nzd',
                                },
                                display_name: 'Next day air',
                                delivery_estimate: {
                                    minimum: {
                                        unit: 'business_day',
                                        value: 1,
                                    },
                                    maximum: {
                                        unit: 'business_day',
                                        value: 1,
                                    },
                                },
                            },
                        },
                    ],
                    line_items: cart.line_items.map(item => {
                        return {
                            price_data: {
                                currency: "nzd",
                                product_data: {
                                    name: String(`${item.title} - ${item.variant_name}`),
                                    images: [item.image]
                                },
                                unit_amount: item.price,
                            },
                            quantity: item.quantity,
                        }
                    }),
                    success_url: `${process.env.SERVER_URL}/success.html`,
                    cancel_url: `${process.env.SERVER_URL}/cancel.html`,
                })
                res.json({ url: session.url })
                
            } else {
                res.status(400).json({ error: 'Cart is empty' });
            }
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ error: 'Cart is empty' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;