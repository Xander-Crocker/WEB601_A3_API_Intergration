//SETUP - Modules
var express = require("express");
var router = express.Router();

const Cart = require('../../models/cart');

//SETUP - Import Middlewares
const { validate, handleValidationErrors, cartSchema } = require("../../middlewares/validation");
const { matchedData, checkSchema} = require("express-validator");
const authorise = require('../../middlewares/auth')

/* -------------------------------------------------------------------------- */
/*                          //SECTION - Create Cart                           */
/* -------------------------------------------------------------------------- */
router.post(
    "/create",
    validate(checkSchema(cartSchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            
            // Check for an existing cart in session
            if (req.session.cart) {
                return res.status(400).json({
                    error: "Cart already exists",
                });
            }

            // Create a new cart
            let cart = new Cart({
                line_items: data.line_items,
            });

            if (data.user_id) {
                cart.user_id = data.user_id;
            }

            // Save the cart
            await cart.save().then((cart) => {
                // req.session.cart = cart._id;
                return res.status(201).json({
                    message: "Cart created successfully",
                    cart: cart,
                });
            }).catch((err) => {
                console.log(err);
                if (err._message === 'Cart validation failed') {
                    return res.status(400).json({
                        error: "Invalid cart. Please try again.",
                    });
                }
                return res.status(500).json({
                    error: "Something went wrong on our end. Please try again. ",
                });
            })


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
