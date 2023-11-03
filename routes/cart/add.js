//SETUP - Modules
var express = require("express");
var router = express.Router();
const axios = require('axios').default;
const base_url = process.env.SERVER_URL;

//SETUP - Import Middlewares
const { validate, handleValidationErrors, lineItemsSchema } = require("../../middlewares/validation");
const { matchedData, checkSchema} = require("express-validator");
const authorize = require('../../middlewares/auth')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Add to Cart                           */
/* -------------------------------------------------------------------------- */
router.post(
    "/add",
    authorize(['admin', 'customer']),
    validate(checkSchema(lineItemsSchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            // console.log(data);
            
            // Validate the product exists and get the variantId.
            let lineItem;

            await axios.get(base_url.concat('api/product/one/').concat(data.product_id)).then(async (response) => {
                if (response.status === 200 && response.statusText === 'OK') {
                    let product = response.data;
                    let options = data.options
                    // console.log(options);
                    // console.log(product.options);
                    let variantName
                    if (options.length === 1) {
                        variantName = String(options[0]);
                    } else {
                        variantName = String(`${options[0]} / ${options[1]}`);
                    }
                    // console.log(variantName);

                    let variant = product.variants.find(v => v.title === variantName);
        
                    // console.log(variantName, variant);
                    if (variant) {
                        let image = product.images.find(image => image.position === 'front' && image.variant_ids.includes(variant.id));
                        if (!image) {
                            image = product.images.find(image => image.is_default === true);
                        }
                        
                        lineItem = {
                            product_id: product.id,
                            variant_id: variant.id,
                            title: product.title,
                            variant_name: variantName,
                            price: variant.price,
                            quantity: data.quantity,
                            image: image.src
                        }
                    } else {
                        return res.status(404).json({
                            error: "Could not identify variant. Please try again.",
                        });
                    }
        
                    // console.log(req.session);
                    // Check for an existing cart in session.
                    if (req.session.cart) {
                        await axios.get(base_url.concat('api/cart/one/').concat(req.session.cart)).then(async(response) => {
                            if (response.status === 200 && response.statusText === 'OK') {
                                let cart = response.data.cart;

                                // check if any of the lineItems have the same productId as the one we're trying to add
                                let existingLineItem = cart.line_items.find(item => item.product_id === lineItem.product_id && item.variant_id === lineItem.variant_id);

                                if (existingLineItem) {
                                    // if so, update the quantity
                                    existingLineItem.quantity += lineItem.quantity;
                                    
                                    if (existingLineItem.quantity <= 0) {
                                        cart.line_items = cart.lineItems.filter(item => item.product_id !== line_item.product_id);
                                    }
                                } else {
                                    // if not, add the lineItem to the cart
                                    cart.line_items.push(lineItem);
                                }
                                await axios.put(base_url.concat('api/cart/update/').concat(req.session.cart), cart).then(async(update) => {
                                    if (update.status === 200 && update.statusText === 'OK') {
                                        res.status(200).json({
                                            message: "Cart updated successfully.",
                                        });
                                    } else {
                                        return res.status(update.status).json({
                                            error: update.error,
                                        });
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    return res.status(500).json({
                                        error: "Something went wrong on our end. Please try again. ",
                                    });
                                });
                            } else {
                                return res.status(404).json({
                                    error: "Cart does not exist",
                                });
                            }
                        }).catch((err) => {
                            console.log(err);
                            return res.status(500).json({
                                error: "Something went wrong on our end. Please try again. ",
                            });
                        });
                    } else {
                        let cart = {
                            line_items : []
                        }
                        cart.line_items.push(lineItem);

                        if (req.session.user) {
                            cart.user_id= req.session.user._id;
                        }
                        
                        axios.post(base_url.concat('api/cart/create/'), cart).then((response) => {
                            if (response.status === 201 && response.statusText === 'Created') {
                                req.session.cart = response.data.cart._id;

                                return res.status(201).json({
                                    message: "Cart created successfully, item added.",
                                    cart: response.data.cart,
                                });
                            } else {
                                return res.status(response.status).json({
                                    error: response.error,
                                });
                            }
                        }).catch((err) => {
                            console.log(err);
                            return res.status(500).json({
                                error: "Something went wrong on our end. Please try again. ",
                            });
                        });
                    }
                } else {
                    return res.status(404).json({
                        error: "Product does not exist",
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).json({
                    error: "Something went wrong on our end. Please try again. ",
                });
            });
        } catch (error) {
            // If there's an error, respond with a server error.
            console.log(error);
            return res.status(500).json({
                error: "Something went wrong on our end. Please try again. ",
            });
        }
    }
);

module.exports = router;
