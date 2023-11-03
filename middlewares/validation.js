const { validationResult } = require('express-validator');
const User = require("../models/user");


const registrationSchema = {
    username: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 3,
                max: 40
            }
        },
        custom: {
            options: value => {
                return User.find({
                    username: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Username already in use')
                    }
                }).catch(error => {
                    return Promise.reject({'error':error})
                })
            }
        }
    },
    given_name: {
        notEmpty: true,
        isString: true,
        trim: true,
        isLength: {
            options: {
                max: 40
            }
        },
        errorMessage: "Given name must be provided"
    },
    family_name: {
        notEmpty: true,
        isString: true,
        trim: true,
        isLength: {
            options: {
                min: 3,
                max: 40
            }
        },
        errorMessage: "Family name must be provided"
    },
    password: {
        trim: true,
        isStrongPassword:  {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            }
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    email: {
        trim: true,
        normalizeEmail: true,
        isEmail: { bail: true },
        custom: {
            options: value => {
                return User.find({
                    email: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Email address already in use')
                    }
                }).catch(error => {
                    return Promise.reject({'error':error})
                })
            }
        }
    }
}



const loginSchema = {
    username: {
        notEmpty: true,
        trim: true,
    },
    password: {
        notEmpty: true,
        trim: true,
    }
}


const updateSchema = {
    password: {
        notEmpty: true,
        trim: true,
    },
    id: {
        equals: {
            options: [
                ':id'
            ],
            negated: true
        }
    },
}

const idOnlySchema= {
    id: {
        equals: {
            options: [
                ':id'
            ],
            negated: true
        }
    },
}

const cartSchema = {
    _id: {
        optional: true,
        isString: true,
        trim: true,
    },
    user_id: {
        optional: true,
        isString: true,
        trim: true,
    },
    line_items: {
        notEmpty: true,
        isArray: true,
        errorMessage: "Line items must be provided"
    },
}
const cartUpdateSchema = {
    _id: {
        notEmpty: true,
        isString: true,
        trim: true,
    },
    product_id: {
        notEmpty: true,
        isString: true,
        trim: true,
    },
}

const lineItemsSchema = {
    product_id: {
        notEmpty: true,
        isString: true,
    },
    options: {
        notEmpty: true,
        isArray: true,
    },
    quantity: {
        notEmpty: true,
        isInt: true,
    },
}

const orderSchema = {
    line_items: {
        notEmpty: true,
        isArray: true,
    },
    shipping_method: {
        notEmpty: true,
        isInt: true,
    },
    address_to: {
        notEmpty: true,
        isObject: true,
    },
}


// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};


// Validator Middleware sourced from:
// https://stackabuse.com/form-data-validation-in-nodejs-with-express-validator/
const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    };
};



// add any validators that need exporting
module.exports = {
    registrationSchema,
    updateSchema,
    loginSchema,
    idOnlySchema,
    cartSchema,
    lineItemsSchema,
    cartUpdateSchema,
    orderSchema,
    handleValidationErrors,
    validate
};


