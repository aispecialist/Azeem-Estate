const JWTService = require('../services/JWTService');
const User = require('../models/userModel');
const UserDTO = require('../dto/user');

const auth = async (req, res, next) => {
    try {
        // 1. Refresh and access token validation
        const { refreshToken, accessToken } = req.cookies;

        if (!refreshToken || !accessToken) {
            const error = {
                status: 401,
                message: 'Unauthorized'
            };

            return next(error);
        }

        let _id;
        try {
            _id = JWTService.verifyAccessToken(accessToken)._id;
        } catch (error) {
            return next(error);
        }

        let user;
        try {
            user = await User.findOne({ _id: _id });
        } catch (error) {
            return next(error);
        }

        // 2. Fetch the user's role from the database
        const userRole = user.role; // Adjust this based on your User model's schema

        // 3. Store user information including role in req.user
        const userDto = new UserDTO(user);
        req.user = { ...userDto, role: userRole }; // Add the role to the user object

        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = auth;
