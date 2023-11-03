const express = require('express');
const router = express.Router();
const axios = require('axios').default;
base_url = process.env.SERVER_URL;

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        await axios.get(base_url.concat('api/product/all')).then((response) => {
            // console.log(response.data);
            res.render('index', { products: response.data.data });
        }).catch((error) => {
            console.log(error);
            res.render('index', { products: {} });
        });
    } catch (error) {
        res.render('index', { products: {} });
    }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

/* GET sign up page. */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Sign Up' });
});

/* GET user account page. */
router.get('/dashboard/account', async function(req, res, next) {
    try {
        await axios.get(base_url.concat('api/user/one/'.concat(req.session.user._id))).then((response) => {
            // console.log(response.data);
            res.render('dashboard/account', { title: 'Account', user: response.data });
        }).catch((error) => {
            console.log(error);
            res.render('dashboard/account', { title: 'Account', user: {} });
        });
    } catch (error) {
        res.render('index', { products: {} });
    }
});

/* GET user orders page. */
router.get('/dashboard/orders', async function(req, res, next) {
    try {
        // console.log(req.session.user);
        await axios.get(base_url.concat('api/order/all/'.concat(req.session.user._id))).then((response) => {
            console.log(response.data);
            res.render('dashboard/orders', { title: 'Orders', orders: response.data.orders });
        }).catch((error) => {
            console.log(error);
            res.render('dashboard/orders', { title: 'Orders', orders: [] });
        });
    } catch (error) {
        console.log(error);
        res.render('dashboard/orders', { title: 'Orders', orders: [] });
    }
});

/* GET user sales page. */
router.get('/dashboard/sales', async function(req, res, next) {
    res.render('dashboard/sales', { title: 'Sales'});
});

/* GET users page. */
router.get('/dashboard/users', async function(req, res, next) {
    res.render('dashboard/users', { title: 'Users'});
});

/* GET product details page. */
router.get('/product/:id', async function(req, res, next) {
    try {
        await axios.get(base_url.concat('api/product/one/'.concat(req.params.id))).then((response) => {
            // console.log(response.data);
            res.render('product_details', { title: 'Product Details', product: response.data, rating: 5 });
        }).catch((error) => {
            console.log(error);
            res.render('product_details', { title: 'Product Details', product: {}, rating: 5 });
        });
    } catch (error) {
        res.render('product_details', { title: 'Product Details', product: {}, rating: 5 });
    }
});

/* GET cart page. */
router.get('/cart', async function(req, res, next) {
    try {
        if (!req.session.cart) {
            res.render('cart', { title: 'Cart', cart: {} });
        }
        
        await axios.get(base_url.concat('api/cart/one/'.concat(req.session.cart))).then((cart) => {
            // console.log(cart.data.cart);
            if (cart.data.cart.length === 0 || !cart.data.cart) {
                return res.status(400).json({ error: 'Cart is empty' });
            }
            res.render('cart', { title: 'Cart', cart: cart.data.cart });
        }).catch((error) => {
            console.log(error);
            res.render('cart', { title: 'Cart', cart: {} });
        });
    } catch (error) {
        res.render('cart', { title: 'Cart', cart: {} });
    }
});


/* GET success page. */
router.get('/success', function(req, res, next) {
    res.render('success', { title: 'Success' });
});

module.exports = router;