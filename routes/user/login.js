//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const { loginSchema, handleValidationErrors, validate } = require('../../middlewares/validation');
const { matchedData, checkSchema } = require('express-validator');


/* -------------------------------------------------------------------------- */
/*                          //SECTION - LogIn                                 */
/* -------------------------------------------------------------------------- */
router.post(
    '/login',
    validate(checkSchema(loginSchema)),
    handleValidationErrors,
    async (req, res, next) => { 
        try{
            // Extract data from the validated data.
            const data = matchedData(req);
            const {
                username,
                password
            } = data;

            // Find the user in the database based on username input
            const user = await User.findOne({username: username});

            // If the user is not found, return an error code 404.
            if (user) {
                
                // Compare the provided password with the hashed password in the database
                bcrypt.compare(password, user.password, function(err, result){
                    if (err) {
                        console.log(err);
                    }

                    if(result){
                        // Create a session for the user upon successful login.
                        // Dont regenerate, to persist cart data through login.                
                        req.session.user = { _id: user._id.toString(), role: user.role };

                        return res.status(200).json({
                            message: `User ${username} logged in successfully.`
                        });
                    } else {
                        return res.status(404).json({ error: 'Invalid username or password.' });
                    }
                });
            } else {
                return res.status(404).json({ error: 'Invalid username or password.' });
            }
        } catch (error) {
            // If there's an error, respond with a server error.
            return res.status(500).json({
                error: "Something went wrong on our end. Please try again. ",
            });
        }
    }
);


module.exports = router;