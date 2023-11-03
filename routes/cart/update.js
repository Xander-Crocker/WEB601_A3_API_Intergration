//SETUP - Modules
var express = require("express");
var router = express.Router();

const Cart = require('../../models/cart');

//SETUP - Import Middlewares
const { validate, handleValidationErrors, cartSchema } = require("../../middlewares/validation");
const { matchedData, checkSchema} = require("express-validator");
const authorise = require('../../middlewares/auth')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Update Cart                           */
/* -------------------------------------------------------------------------- */
router.put(
    "/update/:id",
    authorise(['internal']),
    validate(checkSchema(cartSchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            
            await Cart.findByIdAndUpdate(data._id, data).then((cart) => {
                res.status(200).json({
                    message: "Cart successfully updated",
                });
            }).catch((err) => {
                console.log(err);
                return res.status(404).json({
                    error: "Cart does not exist",
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

router.put(
    "/update/:product_id/:variant_id/quantity",
    authorise(['admin', 'customer']),
    // validate(checkSchema(cartUpdateSchema)),
    // handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            // const data = matchedData(req);
            const data = req.body;
            data.product_id = req.params.product_id;
            data.variant_id = req.params.variant_id;
            const cart_id = req.session.cart;
            // console.log(cart_id, req.session);
            
            await Cart.findById(cart_id).then((cart) => {
                // console.log(cart);

                // If the cart exists, update the quantity of the product in the cart.
                if (cart) {
                    // If the product is already in the cart, update the quantity.
                    cart.line_items.find((item) => {
                        if (item.product_id == data.product_id && item.variant_id == data.variant_id) {
                            if (data.quantity == 0) {
                                cart.line_items.pull(item);
                            }
                            item.quantity = data.quantity;
                        }
                    });

                    cart.save().then((result) =>{
                        res.status(200).json({
                            message: "Cart successfully updated",
                        });
                    }).catch((err) => {
                        console.log(err);
                        return res.status(400).json({
                            error: "Cart was unable to be updated",
                        });
                    });
                } else {
                    return res.status(404).json({
                        error: "Cart does not exist",
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(400).json({
                    error: "Cart was unable to be updated",
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
