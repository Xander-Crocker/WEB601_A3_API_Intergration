//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const { updateSchema, handleValidationErrors, validate } = require('../../middlewares/validation');
const { matchedData, checkSchema } = require('express-validator');
const authorize = require('../../middlewares/auth')


//SETUP - Configure Middlewares
const saltRounds = 10;


/* -------------------------------------------------------------------------- */    
/*                         //SECTION - Update user                            */
/* -------------------------------------------------------------------------- */
router.put(
    '/update/:id',
    authorize(['admin', 'customer']),
    validate(checkSchema(updateSchema)),
    handleValidationErrors,
    async (req, res) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            const { password, id } = data;

            // Hash and salt the password, then store in database.
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                if (err) {
                    console.log(err);
                }

                // update the users password to the database
                User.findByIdAndUpdate(id, { password: hash }).then(result => {
                    if (result.matchedCount = 0) {
                        return res.status(404).send({
                            message: 'Document not found.'
                        });
                    } else if (result.modifiedCount = 0) {
                        return res.status(500).send({ error: 'Document found, but could not be updated.' });
                    } else {
                        return res.status(201).send({
                            message: 'User password changed successfully.'
                        });
                    }
                });
            });
        } catch (error) {
            // If there's an error, respond with an error message
            return res.status(500).send({ error: 'Something went wrong. Please try again.' });
        }
    }
);


module.exports = router;