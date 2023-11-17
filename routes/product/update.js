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
/*                         //SECTION - Update Product (Name)                  */
/* -------------------------------------------------------------------------- */
router.put(
    '/update/:id',
    authorize(['admin', 'customer']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            const {id} = data;

            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            // Update product name

            await axiosRequest.put(`/shops/${shop}/products/${id}.json`, {
                title: req.body.title,
            }).then((response) => {
                //console.log(response.data);
                if(response.data.status == "error"){
                    // log all errors
                    console.log(response.data.errors);
                    return res.status(400).json({ error: "The product was unable to be updated. Please try again."});
                }
                return res.status(200).json({message: "Product updated successfully"});
            }).catch((error) => {
                console.log(error.response.data.errors);
                return res.status(400).json({ error: "The product was unable to be updated. Please try again."});
            });
            
        } catch (error) {
            // If there's an error, respond with an error message
            return res.status(500).send({ error: 'Something went wrong. Please try again.' });
        }
    }
);


module.exports = router;