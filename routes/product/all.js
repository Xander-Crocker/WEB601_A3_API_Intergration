//SETUP - Modules
const express = require('express');
const axios = require('axios').default;
const router = express.Router();


//SETUP - Import Middlewares
const authorizeRoles = require('../../middlewares/auth')


const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});


/* -------------------------------------------------------------------------- */
/*                        //SECTION - Get all products                        */
/* -------------------------------------------------------------------------- */
router.get(
    '/all',
    authorizeRoles(['admin']),
    async (req, res, next) => {
        try {
            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            // Retrieve all products from Printify.
            await axiosRequest.get(`/shops/${shop}/products.json`).then((response) => {
                return res.status(200).json(response.data);
            }).catch((error) => {
                return res.status(400).json({ error: "The products were unable to be retrieved. Please try again."});
            });
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
        }
    }
);


module.exports = router;