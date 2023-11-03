//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const authorize = require('../../middlewares/auth')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get all users                         */
/* -------------------------------------------------------------------------- */
router.get(
    '/all',
    authorize(['admin']),
    async (req, res, next) => {
        try {
            // Retrieve all users from the database.
            let users = await User.find()

            // If users evaluates to true then there are users.
            if (users) {
                return res.status(200).json(users);
            } else {
                return res.status(404).json({ error: "No users exist."});
            }
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
        }
    }
);


module.exports = router;