//SETUP - Modules
var express = require("express");
var router = express.Router();
const axios = require('axios').default;
const base_url = process.env.SERVER_URL;


//SETUP - Import Middlewares
const { validate, handleValidationErrors, idOnlySchema } = require("../../middlewares/validation");
const { matchedData, checkSchema } = require("express-validator");
const authorise = require('../../middlewares/auth');

//SETUP - Configure Middlewares
const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});

/* -------------------------------------------------------------------------- */
/*                        //SECTION - Get All Orders                          */
/* -------------------------------------------------------------------------- */
router.get(
    "/all/:id",
    authorise(['admin', 'customer']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            console.log(req.session);
            // reject request if a customer tries to modify another customer's order

            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            let orders = [];

            await axiosRequest.get(`/shops/${shop}/orders.json`).then(async (response) => {
                orders = response.data.data;

                // console.log(response.data);
                // console.log(orders);


                if(orders.length === 0) {
                    return res.status(404).json({ error: "No orders found."});
                }
                // if there is a next_page_url, get the next page of orders.
                for (let i = response.data.current_page; i < response.data.last_page; i++) {
                    await axiosRequest.get(`/shops/${shop}/orders.json${response.data.next_page_url}`).then((response) => {
                        // console.log(response.data.data);
                        orders = orders.concat(response.data.data);
                    }).catch((error) => {
                        console.log(error);
                        return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
                    });
                }


                // console.log(data)
                if (data.id) {
                    await axios.get(base_url.concat('api/user/one/').concat(data.id)).then((response) => {
                        if (response.status === 200 && response.statusText === 'OK') {
                            let user = response.data;
                            orders = orders.filter(order => {
                                if (order.address_to.email === null) {
                                    return false;
                                }
                                return order.address_to.email.toLowerCase() === user.email.toLowerCase()
                            });
                            
                            if(orders.length === 0) {
                                return res.status(404).json({ error: "No orders found."});
                            } else {
                                return res.status(200).json({ orders });
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
                    });
                } else {

                    return res.status(200).json({ orders });
                }
            }).catch((error) => {
                console.log(error);
                return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
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


router.get(
    "/all",
    authorise(['admin']),
    // validate(checkSchema(idOnlySchema)),
    // handleValidationErrors,
    async (req, res, next) => {
        try {
            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            let orders = [];

            await axiosRequest.get(`/shops/${shop}/orders.json`).then(async (response) => {
                orders = response.data.data;

                if(orders.length === 0) {
                    return res.status(404).json({ error: "No orders found."});
                }
                // if there is a next_page_url, get the next page of orders.
                for (let i = response.data.current_page; i < response.data.last_page; i++) {
                    await axiosRequest.get(`/shops/${shop}/orders.json${response.data.next_page_url}`).then((response) => {
                        // console.log(response.data.data);
                        orders = orders.concat(response.data.data);
                    }).catch((error) => {
                        console.log(error);
                        return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
                    });
                }

                return res.status(200).json({ orders });
            }).catch((error) => {
                console.log(error);
                return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
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
