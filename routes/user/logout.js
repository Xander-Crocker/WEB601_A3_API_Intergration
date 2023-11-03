//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Middlewares
const authorize = require('../../middlewares/auth')


/* -------------------------------------------------------------------------- */
/*                             //SECTION - Logout                             */
/* -------------------------------------------------------------------------- */
router.get(
    '/logout',
    authorize(['admin', 'customer']),
    (req, res) => {
        try {
            // Clear the user's session
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Logout failed.' });
                } else {
                    return res.status(200).json({ message: 'Logout successful.' });
                }
            });
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
        }
    }
);


module.exports = router;