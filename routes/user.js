const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();

//get update user
router.get(
    '/update',
    isAuth,
    userController.getUpdateUser
);

//update user
router.post(
    '/update',
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
        body('firstName')
            .trim()
            .not()
            .isEmpty(),
        body('lastName')
            .trim()
            .not()
            .isEmpty()
    ],
    isAuth,
    userController.putUpdateUser
);

//get user
router.get(
    '/profile',
    isAuth,
    userController.getUser
);


module.exports = router;