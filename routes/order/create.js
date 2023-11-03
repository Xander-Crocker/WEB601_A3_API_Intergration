//SETUP - Modules
var express = require("express");
var router = express.Router();
const axios = require('axios').default;


//SETUP - Import Middlewares
const { validate, handleValidationErrors, orderSchema } = require("../../middlewares/validation");
const { matchedData, checkSchema } = require("express-validator");
const authorise = require('../../middlewares/auth')

//SETUP - Configure Middlewares
const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});

/* -------------------------------------------------------------------------- */
/*                          //SECTION - Create Order                          */
/* -------------------------------------------------------------------------- */
router.post(
    "/create",
    authorise(['admin', 'customer']),
    validate(checkSchema(orderSchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            //TODO - create a validation schema for this route.
            // Extract data from the validated data.
            const data = matchedData(req);
            // console.log(data);
            // console.log(req.body);

            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            await axiosRequest.post(`/shops/${shop}/orders.json`, data  ).then((response) => {
                // console.log(response.data);
                return res.status(201).json({message: "Order created successfully", order_id: response.data.id});
            }).catch((error) => {
                console.log(error);
                return res.status(400).json({ error: "The order was unable to be created. Please try again."});
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
