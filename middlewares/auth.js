// Define a middleware for role-based authorization
function authorize(roles) {
    return (req, res, next) => {
        try {
            // Check if the origin is trusted.
            const originIsTrusted = process.env.TRUSTED_ORIGINS.includes(req.hostname) || process.env.TRUSTED_ORIGINS.includes(req.ip);

            // check if the request is not from Postman
            if (!req.headers['user-agent'].startsWith('Postman')) {
                // If the origin is trusted, skip authentication and authorisation.
                if (originIsTrusted) {
                    return next();
                }
            }
            const user = req.session.user
            const id = req.params.id
    
            // Check the request is authenticated.
            if (!user) {
                return res.status(401).send({
                    message: 'You are currently not authenticated.',
                });
            }
            
            // Check the request is authorised.
            if (!roles.includes(user.role)) {
                return res.status(403).send({
                    message: 'You are not authorised to perform this action.',
                });
            }
            
            // Check if the request url is api/user and the id matches the user id
            if (req.baseUrl.includes('user') && id !== user._id.toString()) {
                if (!req.url.includes('logout')) {
                    if (user.role !== 'admin') {
                        return res.status(403).send({
                            message: 'You are not authorised to perform this action.',
                        });
                    }
                }
            }
            if (req.baseUrl.includes('order') && id !== user._id.toString()) {
                if (user.role !== 'admin') {
                    return res.status(403).send({
                        message: 'You are not authorised to perform this action.',
                    });
                }
            }
    
            // If the request is PUT or DELETE, make sure the user only modifies itself.
            // if (req.method === 'PUT' || req.method === 'DELETE') {
            //     // Check if the user is an admin or the user whose data is being modified
            //     if (user.role !== 'admin' && id !== user._id.toString()) {
            //         return res.status(403).send({
            //             message: 'You are not authorised to perform this action.',
            //         });
            //     }
            // }
            
            return next();         
        } catch (error) {
            
            console.log(error);
            res.status(500).send({'error': 'Something went wrong on our end. Please try again.'});
        }
    };
}

module.exports = authorize