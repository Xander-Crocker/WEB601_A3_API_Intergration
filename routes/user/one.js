//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const { idOnlySchema, handleValidationErrors, validate } = require('../../middlewares/validation');
const { matchedData, checkSchema } = require('express-validator');
const authorize = require('../../middlewares/auth')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get one user                          */
/* -------------------------------------------------------------------------- */
router.get(
    '/one/:id', 
    authorize(['admin', 'customer']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {  
            // Extract data from the validated data.
            const data = matchedData(req);
            const {id} = data;

            // Retrieve all users from the database.
            let user = await User.findById(id)

            // If users evaluates to true then there are users. 
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ error: "No user with provided ID exists."});
            }
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
        }
    }
);


module.exports = router;