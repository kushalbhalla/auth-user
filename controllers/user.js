const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const User = require("../models/User");

//get update user
exports.getUpdateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        return res.status(422).render('user/edit', {
            path: '/edit',
            pageTitle: 'Edit',
            errorMessage: error.message
        });
    };

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                return res.status(error.statusCode).render('user/edit', {
                    path: '/edit',
                    pageTitle: 'Edit',
                    errorMessage: error.message
                });
            }

            const {password, ...other} = user._doc;
            return other;
        })
        .then(result => {
            res.status(200).render('user/edit', {
                path: '/edit',
                pageTitle: 'Edit',
                user: result,
                errorMessage: null
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//update user
exports.putUpdateUser = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                return res.status(error.statusCode).render('user/edit', {
                    path: '/edit',
                    pageTitle: 'Edit',
                    errorMessage: error.message
                });
            }

            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;

            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.save();
            
            const { password, ...userDetails } = user._doc;
            return userDetails;
        })
        .then(result => {
            res.redirect('/user/profile');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//get user
exports.getUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        return res.status(422).render('user/profile', {
            path: '/profile',
            pageTitle: 'Profile',
            errorMessage: error.message
        });
    }

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                return res.status(error.statusCode).render('user/edit', {
                    path: '/edit',
                    pageTitle: 'Edit',
                    errorMessage: error.message
                });
            }

            const {password, ...other} = user._doc;
            return other;
        })
        .then(result => {
            res.status(200).render('user/profile', {
                user: result,
                pageTitle : 'User Profile',
                path: '/user/profile',
                errorMessage: null
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

