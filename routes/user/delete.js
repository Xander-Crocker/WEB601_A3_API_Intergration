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
/*                          //SECTION - Delete User                           */
/* -------------------------------------------------------------------------- */
router.delete(
    '/delete/:id',
    authorize(['admin', 'customer']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) =>{
        try {    
            // Extract data from the validated data.
            const data = matchedData(req);
            const {id} = data;

            // Check if email or username exists in the database
            const existingUser = await User.findById(id);

            // Check for user in the database, if not found return an error code 404.
            if (!existingUser) {
                return res.status(404).json({ error: `No user with that id could be found.` });
            }
            
            // Delete the user
            await User.findByIdAndDelete(id);

            // Return a success response
            return res.status(200).json({ message: `User ${existingUser.username} deleted successfully.` });

        } catch (error){
            // If there's an error, respond with a server error.
            return res.status(500).json({
                error: "Something went wrong on our end. Please try again. ",
            });
        }
    }
);


module.exports = router;