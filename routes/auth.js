const express = require('express');
const { body } = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/auth');
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

//get register
router.get(
    '/register',
    authController.getRegister
);

//get login
router.get(
    '/login',
    authController.getLogin
);

//register user
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value}).then(userDoc=> {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body(
                'password',
                'Please enter a password with at least 5 characters'
            )
            .isLength({ min: 5})
            .isAlphanumeric(),
        body('firstName')
            .trim()
            .not()
            .isEmpty(),
        body('lastName')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.postRegister
);

//login user
router.post(
    '/login',
    authController.postLogin
);

router.post(
    '/logout',
    isAuth,
    authController.postLogout
)


module.exports = router;