//SETUP - Modules
const express = require('express');
const axios = require('axios').default;
const router = express.Router();

//SETUP - Import Middlewares
const { idOnlySchema, handleValidationErrors, validate } = require('../../middlewares/validation');
const { matchedData, checkSchema } = require('express-validator');
const authorize = require('../../middlewares/auth')


//SETUP - Configure Middlewares
const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});

/* -------------------------------------------------------------------------- */
/*                        //SECTION - Get one product                         */
/* -------------------------------------------------------------------------- */
router.get(
    '/one/:id',
    authorize(['admin']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {            
            // Extract data from the validated data.
            const data = matchedData(req);
            const {id} = data;

            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            // Retrieve the product from Printify.
            await axiosRequest.get(`/shops/${shop}/products/${id}.json`).then((response) => {
                // console.log(response);
                return res.status(200).json(response.data);
            }).catch((error) => {
                return res.status(400).json({ error: "The product was unable to be retrieved. Please try again."});
            });
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
        }
    }
);


module.exports = router;